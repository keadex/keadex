//! A collection of tasks spawned in JavaScript runtime.
//!
//! This module provides the [`JoinSet`] type, a collection which stores a set
//! of spawned tasks and allows asynchronously awaiting the output of those
//! tasks as they complete. See the documentation for the [`JoinSet`] type for
//! details.
use crate::multithreading::tokio::glue::common::noop_waker;
use crate::multithreading::tokio::glue::task::{
  spawn, spawn_blocking, AbortHandle, JoinError, JoinHandle,
};
use std::collections::VecDeque;
use std::fmt::{Debug, Formatter};
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

/// A collection of tasks spawned in JavaScript.
///
/// A `JoinSet` can be used to await the completion of some or all of the tasks
/// in the set. The set is not guaranteed to be ordered,
/// and the tasks will be returned in the order they complete.
///
/// All of the tasks must have the same return type `T`.
///
/// When the `JoinSet` is dropped, all tasks in the `JoinSet` are immediately aborted.
///
/// # Examples
///
/// Spawn multiple tasks and wait for them.
///
/// ```
/// use tokio::task::JoinSet;
///
/// #[tokio::main]
/// async fn main() {
///     let mut set = JoinSet::new();
///
///     for i in 0..10 {
///         set.spawn(async move { i });
///     }
///
///     let mut seen = [false; 10];
///     while let Some(res) = set.join_next().await {
///         let idx = res.unwrap();
///         seen[idx] = true;
///     }
///
///     for i in 0..10 {
///         assert!(seen[i]);
///     }
/// }
/// ```
pub struct JoinSet<T> {
  inner: VecDeque<JoinHandle<T>>,
}

impl<T> JoinSet<T> {
  /// Create a new `JoinSet`.
  pub fn new() -> Self {
    Self {
      inner: VecDeque::new(),
    }
  }

  /// Returns the number of tasks currently in the `JoinSet`.
  pub fn len(&self) -> usize {
    self.inner.len()
  }

  /// Returns whether the `JoinSet` is empty.
  pub fn is_empty(&self) -> bool {
    self.inner.is_empty()
  }
}

impl<T: 'static> JoinSet<T> {
  /// Spawn the provided task on the `JoinSet`, returning an [`AbortHandle`]
  /// that can be used to remotely cancel the task.
  ///
  /// The provided future will start running in the background immediately
  /// when this method is called, even if you don't await anything on this
  /// `JoinSet`.
  ///
  /// [`AbortHandle`]: crate::task::AbortHandle
  #[track_caller]
  pub fn spawn<F>(&mut self, task: F) -> AbortHandle
  where
    F: Future<Output = T>,
    F: 'static,
  {
    let join_handle = spawn(task);
    let abort_handle = join_handle.abort_handle();
    self.inner.push_back(join_handle);
    abort_handle
  }

  /// Spawn the blocking code on the blocking threadpool and store
  /// it in this `JoinSet`, returning an [`AbortHandle`] that can be
  /// used to remotely cancel the task.
  ///
  /// # Examples
  ///
  /// Spawn multiple blocking tasks and wait for them.
  ///
  /// ```
  /// use tokio::task::JoinSet;
  ///
  /// #[tokio::main]
  /// async fn main() {
  ///     let mut set = JoinSet::new();
  ///
  ///     for i in 0..10 {
  ///         set.spawn_blocking(move || { i });
  ///     }
  ///
  ///     let mut seen = [false; 10];
  ///     while let Some(res) = set.join_next().await {
  ///         let idx = res.unwrap();
  ///         seen[idx] = true;
  ///     }
  ///
  ///     for i in 0..10 {
  ///         assert!(seen[i]);
  ///     }
  /// }
  /// ```
  ///
  /// [`AbortHandle`]: crate::task::AbortHandle
  #[track_caller]
  pub fn spawn_blocking<F>(&mut self, f: F) -> AbortHandle
  where
    F: FnOnce() -> T,
    F: Send + 'static,
    T: Send,
  {
    let join_handle = spawn_blocking(f);
    let abort_handle = join_handle.abort_handle();
    self.inner.push_back(join_handle);
    abort_handle
  }

  /// Waits until one of the tasks in the set completes and returns its output.
  ///
  /// Returns `None` if the set is empty.
  ///
  /// # Cancel Safety
  ///
  /// This method is cancel safe. If `join_next` is used as the event in a `tokio::select!`
  /// statement and some other branch completes first, it is guaranteed that no tasks were
  /// removed from this `JoinSet`.
  pub async fn join_next(&mut self) -> Option<Result<T, JoinError>> {
    std::future::poll_fn(|cx| self.poll_join_next(cx)).await
  }

  /// Tries to join one of the tasks in the set that has completed and return its output.
  ///
  /// Returns `None` if there are no completed tasks, or if the set is empty.
  pub fn try_join_next(&mut self) -> Option<Result<T, JoinError>> {
    // Get the number of `JoinHandle`s.
    let handle_count = self.inner.len();
    if handle_count == 0 {
      return None;
    }

    // Create an async context with a waker that does nothing.
    let waker = noop_waker();
    let mut cx = Context::from_waker(&waker);

    // Loop over all `JoinHandle`s to find one that's ready.
    for _ in 0..handle_count {
      let mut handle = match self.inner.pop_front() {
        Some(inner) => inner,
        None => continue, // Logically never none
      };
      let polled = Pin::new(&mut handle).poll(&mut cx);
      if let Poll::Ready(result) = polled {
        return Some(result);
      }
      self.inner.push_back(handle);
    }

    None
  }

  /// Aborts all tasks and waits for them to finish shutting down.
  ///
  /// Calling this method is equivalent to calling [`abort_all`] and then calling [`join_next`] in
  /// a loop until it returns `None`.
  ///
  /// This method ignores any panics in the tasks shutting down. When this call returns, the
  /// `JoinSet` will be empty.
  ///
  /// [`abort_all`]: fn@Self::abort_all
  /// [`join_next`]: fn@Self::join_next
  pub async fn shutdown(&mut self) {
    self.abort_all();
    while self.join_next().await.is_some() {}
  }

  /// Awaits the completion of all tasks in this `JoinSet`, returning a vector of their results.
  ///
  /// The results will be stored in the order they completed not the order they were spawned.
  /// This is a convenience method that is equivalent to calling [`join_next`] in
  /// a loop. If any tasks on the `JoinSet` fail with an [`JoinError`], then this call
  /// to `join_all` will panic and all remaining tasks on the `JoinSet` are
  /// cancelled. To handle errors in any other way, manually call [`join_next`]
  /// in a loop.
  ///
  /// # Examples
  ///
  /// Spawn multiple tasks and `join_all` them.
  ///
  /// ```
  /// use tokio::task::JoinSet;
  /// use std::time::Duration;
  ///
  /// #[tokio::main]
  /// async fn main() {
  ///     let mut set = JoinSet::new();
  ///
  ///     for i in 0..3 {
  ///        set.spawn(async move {
  ///            tokio::time::sleep(Duration::from_secs(3 - i)).await;
  ///            i
  ///        });
  ///     }
  ///
  ///     let output = set.join_all().await;
  ///     assert_eq!(output, vec![2, 1, 0]);
  /// }
  /// ```
  ///
  /// Equivalent implementation of `join_all`, using [`join_next`] and loop.
  ///
  /// ```
  /// use tokio::task::JoinSet;
  /// use std::panic;
  ///
  /// #[tokio::main]
  /// async fn main() {
  ///     let mut set = JoinSet::new();
  ///
  ///     for i in 0..3 {
  ///        set.spawn(async move {i});
  ///     }
  ///
  ///     let mut output = Vec::new();
  ///     while let Some(res) = set.join_next().await{
  ///         match res {
  ///             Ok(t) => output.push(t),
  ///             Err(_) => (),
  ///         }
  ///     }
  ///     assert_eq!(output.len(),3);
  /// }
  /// ```
  /// [`join_next`]: fn@Self::join_next
  /// [`JoinError::id`]: fn@crate::task::JoinError::id
  pub async fn join_all(mut self) -> Vec<T> {
    let mut output = Vec::with_capacity(self.len());

    while let Some(res) = self.join_next().await {
      if let Ok(t) = res {
        output.push(t)
      }
    }
    output
  }

  /// Aborts all tasks on this `JoinSet`.
  ///
  /// This does not remove the tasks from the `JoinSet`. To wait for the tasks to complete
  /// cancellation, you should call `join_next` in a loop until the `JoinSet` is empty.
  pub fn abort_all(&mut self) {
    self.inner.iter().for_each(|jh| jh.abort());
  }

  /// Removes all tasks from this `JoinSet` without aborting them.
  ///
  /// The tasks removed by this call will continue to run in the background even if the `JoinSet`
  /// is dropped.
  pub fn detach_all(&mut self) {
    self.inner.clear();
  }

  /// Polls for one of the tasks in the set to complete.
  ///
  /// If this returns `Poll::Ready(Some(_))`, then the task that completed is removed from the set.
  ///
  /// When the method returns `Poll::Pending`, the `Waker` in the provided `Context` is scheduled
  /// to receive a wakeup when a task in the `JoinSet` completes. Note that on multiple calls to
  /// `poll_join_next`, only the `Waker` from the `Context` passed to the most recent call is
  /// scheduled to receive a wakeup.
  ///
  /// # Returns
  ///
  /// This function returns:
  ///
  ///  * `Poll::Pending` if the `JoinSet` is not empty but there is no task whose output is
  ///    available right now.
  ///  * `Poll::Ready(Some(Ok(value)))` if one of the tasks in this `JoinSet` has completed.
  ///    The `value` is the return value of one of the tasks that completed.
  ///  * `Poll::Ready(Some(Err(err)))` if one of the tasks in this `JoinSet` has panicked or been
  ///    aborted. The `err` is the `JoinError` from the panicked/aborted task.
  ///  * `Poll::Ready(None)` if the `JoinSet` is empty.
  ///
  /// Note that this method may return `Poll::Pending` even if one of the tasks has completed.
  /// This can happen if the [coop budget] is reached.
  ///
  /// [coop budget]: crate::task#cooperative-scheduling
  pub fn poll_join_next(&mut self, cx: &mut Context<'_>) -> Poll<Option<Result<T, JoinError>>> {
    // Get the number of `JoinHandle`s.
    let handle_count = self.inner.len();
    if handle_count == 0 {
      return Poll::Ready(None);
    }

    // Loop over all `JoinHandle`s to find one that's ready.
    for _ in 0..handle_count {
      let mut handle = match self.inner.pop_front() {
        Some(inner) => inner,
        None => continue, // Logically never none
      };
      let polled = Pin::new(&mut handle).poll(cx);
      if let Poll::Ready(result) = polled {
        return Poll::Ready(Some(result));
      }
      self.inner.push_back(handle);
    }

    Poll::Pending
  }
}

impl<T> Drop for JoinSet<T> {
  fn drop(&mut self) {
    self
      .inner
      .iter()
      .for_each(|join_handle| join_handle.abort());
  }
}

impl<T> Debug for JoinSet<T> {
  fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
    f.debug_struct("JoinSet").field("len", &self.len()).finish()
  }
}

impl<T> Default for JoinSet<T> {
  fn default() -> Self {
    Self::new()
  }
}
