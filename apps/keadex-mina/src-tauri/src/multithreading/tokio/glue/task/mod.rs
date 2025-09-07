//! Asynchronous green-threads.
//!
//! Resembling the familiar `tokio::task` patterns.
//! this module leverages web workers to execute tasks in parallel,
//! making it ideal for high-performance web applications.

pub mod pool;

use crate::error_handling::mina_error::MinaError;
use crate::multithreading::parallel_executor::MinaFuture;
use crate::multithreading::tokio::glue::common::{
  is_main_thread, once_channel, set_timeout, LogError, OnceReceiver, OnceSender,
};
use js_sys::Promise;
use pool::WorkerPool;
use std::error::Error;
use std::fmt::{Debug, Display, Formatter};
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};
use wasm_bindgen::prelude::JsValue;
use wasm_bindgen_futures::{spawn_local, JsFuture};

thread_local! {
    static WORKER_POOL: WorkerPool = WorkerPool::new();
}

/// Manages the worker pool by periodically checking for
/// inactive web workers and queued tasks.
pub fn start_managing_pool() {
  let was_managing = WORKER_POOL.with(|worker_pool| {
    worker_pool.cancel_stop_request();
    let was_managing = worker_pool.is_managing();
    if !was_managing {
      log::debug!("Starting managing worker pool...");
      worker_pool.start_managing();
    }
    return was_managing;
  });
  if !was_managing {
    log::debug!("Started managing worker pool...");
    spawn_local(async {
      loop {
        let pool_info = WORKER_POOL.with(|worker_pool| {
          log::debug!("Managing worker pool...");
          worker_pool.remove_inactive_workers();
          worker_pool.flush_queued_tasks();
          return (worker_pool.stop_requested(), worker_pool.get_worker_count());
        });
        if pool_info.0 && pool_info.1 <= 0 {
          log::debug!("Stopped managing worker pool...");
          WORKER_POOL.with(|worker_pool| {
            worker_pool.stop_managing();
            worker_pool.cancel_stop_request();
          });
          break;
        }
        let promise = Promise::new(&mut |resolve, _reject| {
          set_timeout(&resolve, 100.0);
        });
        JsFuture::from(promise).await.log_error("MANAGE_POOL");
      }
    });
  }
}

pub fn stop_managing_pool() {
  log::debug!("Required stopping managing worker pool...");
  WORKER_POOL.with(|worker_pool| {
    worker_pool.require_stop();
  });
}

/// Runs the provided closure on a web worker(thread) where blocking is acceptable.
///
/// In general, issuing a blocking call or performing a lot of compute in a
/// future without yielding is problematic, as it may prevent the JavaScript runtime from
/// driving other futures forward. This function runs the provided closure on a
/// web worker dedicated to blocking operations.
///
/// More and more web workers will be spawned when they are requested through this
/// function until the upper limit of 512 is reached.
/// After reaching the upper limit, the tasks will wait for
/// any of the web workers to become idle.
/// When a web worker remains idle for 10 seconds, it will be terminated
/// and get removed from the worker pool, which is a similiar behavior to that of `tokio`.
/// The web worker limit is very large by default, because `spawn_blocking` is often
/// used for various kinds of IO operations that cannot be performed
/// asynchronously.  When you run CPU-bound code using `spawn_blocking`, you
/// should keep this large upper limit in mind.
///
/// # Examples
///
/// Pass an input value and receive result of computation:
///
/// ```
/// use tokio_with_wasm as tokio;
///
/// // Initial input
/// let mut data = "Hello, ".to_string();
/// let output = tokio::task::spawn_blocking(move || {
///     // Stand-in for compute-heavy work or using synchronous APIs
///     data.push_str("world");
///     // Pass ownership of the value back to the asynchronous context
///     data
/// }).await?;
///
/// // `output` is the value returned from the thread
/// assert_eq!(output.as_str(), "Hello, world");
/// Ok(())
/// ```
pub fn spawn_blocking<C, O>(callable: C) -> JoinHandle<O>
where
  C: Future<Output = O> + 'static,
  O: 'static,
{
  if !is_main_thread() {
    JsValue::from_str(concat!(
      "Calling `spawn_blocking` in a blocking thread is not allowed. ",
      "While this is possible in real `tokio`, ",
      "it may cause undefined behavior in the JavaScript environment. ",
      "Instead, use `tokio::sync::mpsc::channel` ",
      "to listen for messages from the main thread ",
      "and spawn a task there."
    ))
    .log_error("SPAWN_BLOCKING");
    panic!();
  }
  let (join_sender, join_receiver) = once_channel::<Result<O, JoinError>>();
  let (cancel_sender, cancel_receiver) = once_channel::<()>();
  WORKER_POOL.with(move |worker_pool| {
    worker_pool.queue_task(async move {
      if cancel_receiver.is_done() {
        join_sender.send(Err(JoinError { cancelled: true }));
        return;
      }
      let returned = callable.await;
      join_sender.send(Ok(returned));
    })
  });
  JoinHandle {
    join_receiver,
    cancel_sender,
  }
}

/// An owned permission to join on a task (awaiting its termination).
///
/// This can be thought of as the equivalent of
/// [`std::thread::JoinHandle`] or `tokio::task::JoinHandle` for
/// a task that is executed concurrently.
///
/// A `JoinHandle` *detaches* the associated task when it is dropped, which
/// means that there is no longer any handle to the task, and no way to `join`
/// on it.
///
/// This struct is created by the [`spawn`] and [`spawn_blocking`]
/// functions.
///
/// # Examples
///
/// Creation from [`spawn`]:
///
/// ```
/// use tokio_with_wasm as tokio;
/// use tokio::spawn;
///
/// let join_handle: tokio::task::JoinHandle<_> = spawn(async {
///     // some work here
/// });
/// ```
///
/// Creation from [`spawn_blocking`]:
///
/// ```
/// use tokio_with_wasm as tokio;
/// use tokio::task::spawn_blocking;
///
/// let join_handle: tokio::task::JoinHandle<_> = spawn_blocking(|| {
///     // some blocking work here
/// });
/// ```
///
/// Child being detached and outliving its parent:
///
/// ```no_run
/// use tokio_with_wasm as tokio;
/// use tokio::spawn;
///
/// let original_task = spawn(async {
///     let _detached_task = spawn(async {
///         // Here we sleep to make sure that the first task returns before.
///         // Assume that code takes a few seconds to execute here.
///         // This will be called, even though the JoinHandle is dropped.
///         println!("♫ Still alive ♫");
///     });
/// });
///
/// original_task.await;
/// println!("Original task is joined.");
/// ```
pub struct JoinHandle<T> {
  join_receiver: OnceReceiver<Result<T, JoinError>>,
  cancel_sender: OnceSender<()>,
}

impl<T> Future for JoinHandle<T> {
  type Output = Result<T, JoinError>;
  fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
    let pinned_receiver = Pin::new(&mut self.join_receiver);
    pinned_receiver.poll(cx)
  }
}

impl<T> Debug for JoinHandle<T>
where
  T: Debug,
{
  fn fmt(&self, fmt: &mut Formatter<'_>) -> std::fmt::Result {
    fmt.debug_struct("JoinHandle").finish()
  }
}

impl<T> JoinHandle<T> {
  /// Abort the task associated with the handle.
  ///
  /// Awaiting a cancelled task might complete as usual if the task was
  /// already completed at the time it was cancelled, but most likely it
  /// will fail with a cancelled `JoinError`.
  ///
  /// Be aware that tasks spawned using [`spawn_blocking`] cannot be aborted
  /// because they are not async. If you call `abort` on a `spawn_blocking`
  /// task, then this *will not have any effect*, and the task will continue
  /// running normally. The exception is if the task has not started running
  /// yet; in that case, calling `abort` may prevent the task from starting.
  ///
  /// ```rust
  /// use tokio_with_wasm as tokio;
  /// use tokio::time;
  ///
  /// # #[tokio::main(flavor = "current_thread", start_paused = true)]
  /// # async fn main() {
  /// let mut handles = Vec::new();
  ///
  /// handles.push(tokio::spawn(async {
  ///    time::sleep(time::Duration::from_secs(10)).await;
  ///    true
  /// }));
  ///
  /// handles.push(tokio::spawn(async {
  ///    time::sleep(time::Duration::from_secs(10)).await;
  ///    false
  /// }));
  ///
  /// for handle in &handles {
  ///     handle.abort();
  /// }
  ///
  /// for handle in handles {
  ///     assert!(handle.await.unwrap_err().is_cancelled());
  /// }
  /// # }
  /// ```
  pub fn abort(&self) {
    self.cancel_sender.send(());
  }

  /// Checks if the task associated with this `JoinHandle` has finished.
  ///
  /// Please note that this method can return `false` even if [`abort`] has been
  /// called on the task. This is because the cancellation process may take
  /// some time, and this method does not return `true` until it has
  /// completed.
  pub fn is_finished(&self) -> bool {
    self.join_receiver.is_done()
  }

  /// Returns a new `AbortHandle` that can be used to remotely abort this task.
  pub fn abort_handle(&self) -> AbortHandle {
    AbortHandle {
      cancel_sender: self.cancel_sender.clone(),
    }
  }
}

/// Returned when a task failed to execute to completion.
#[derive(Debug)]
pub struct JoinError {
  cancelled: bool,
}

impl Display for JoinError {
  fn fmt(&self, fmt: &mut Formatter<'_>) -> std::fmt::Result {
    fmt.write_str("task failed to execute to completion")
  }
}

impl Error for JoinError {}

impl JoinError {
  pub fn is_cancelled(&self) -> bool {
    self.cancelled
  }
}

/// An owned permission to abort a spawned task, without awaiting its completion.
///
/// Unlike a [`JoinHandle`], an `AbortHandle` does *not* represent the
/// permission to await the task's completion, only to terminate it.
///
/// The task may be aborted by calling the [`AbortHandle::abort`] method.
/// Dropping an `AbortHandle` releases the permission to terminate the task
/// --- it does *not* abort the task.
///
/// Be aware that tasks spawned using [`spawn_blocking`] cannot be aborted
/// because they are not async. If you call `abort` on a `spawn_blocking` task,
/// then this *will not have any effect*, and the task will continue running
/// normally. The exception is if the task has not started running yet; in that
/// case, calling `abort` may prevent the task from starting.
///
/// [`JoinHandle`]: crate::task::JoinHandle
/// [`spawn_blocking`]: crate::task::spawn_blocking
#[derive(Clone)]
pub struct AbortHandle {
  cancel_sender: OnceSender<()>,
}

impl AbortHandle {
  /// Abort the task associated with the handle.
  ///
  /// Awaiting a cancelled task might complete as usual if the task was
  /// already completed at the time it was cancelled, but most likely it
  /// will fail with a [cancelled] `JoinError`.
  ///
  /// If the task was already cancelled, such as by [`JoinHandle::abort`],
  /// this method will do nothing.
  ///
  /// Be aware that tasks spawned using [`spawn_blocking`] cannot be aborted
  /// because they are not async. If you call `abort` on a `spawn_blocking`
  /// task, then this *will not have any effect*, and the task will continue
  /// running normally. The exception is if the task has not started running
  /// yet; in that case, calling `abort` may prevent the task from starting.
  pub fn abort(&self) {
    self.cancel_sender.send(());
  }
}

impl Debug for AbortHandle {
  fn fmt(&self, fmt: &mut Formatter<'_>) -> std::fmt::Result {
    fmt.debug_struct("AbortHandle").finish()
  }
}
