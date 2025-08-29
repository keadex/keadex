use crate::multithreading::tokio::glue::common::{now, LogError};
use js_sys::{global, Array, JsString, Object, Reflect};
use std::cell::RefCell;
use std::collections::VecDeque;
use std::future::Future;
use std::pin::Pin;
use std::rc::Rc;
use wasm_bindgen::prelude::{wasm_bindgen, Closure, JsCast, JsValue};
use wasm_bindgen::{memory, module};
use web_sys::{
  Blob, BlobPropertyBag, DedicatedWorkerGlobalScope, ErrorEvent, Event, MessageEvent, Url, Worker,
  WorkerOptions, WorkerType,
};

pub static MAX_WORKERS: usize = 512;

thread_local! {
    static MINA_LIVE_SCRIPT_PATH: RefCell<Option<String>> = RefCell::new(None);
}

pub struct WorkerPool {
  pool_state: Rc<PoolState>,
}

struct PoolState {
  total_workers_count: RefCell<usize>,
  idle_workers: RefCell<Vec<ManagedWorker>>,
  queued_tasks: RefCell<VecDeque<Task>>,
  callback: Closure<dyn FnMut(Event)>,
  managing: RefCell<bool>,
  stop_requested: RefCell<bool>,
}

struct ManagedWorker {
  deactivated_time: RefCell<f64>, // Timestamp in milliseconds
  worker: Worker,
}

struct Task {
  callable: Pin<Box<dyn Future<Output = ()>>>,
}

impl Default for WorkerPool {
  fn default() -> Self {
    WorkerPool {
      pool_state: Rc::new(PoolState {
        total_workers_count: RefCell::new(0),
        idle_workers: RefCell::new(Vec::with_capacity(MAX_WORKERS)),
        queued_tasks: RefCell::new(VecDeque::new()),
        callback: Closure::new(|event: Event| {
          JsValue::from_str(&format!("{:?}", event)).log_error("POOL_CALLBACK");
        }),
        managing: RefCell::new(false),
        stop_requested: RefCell::new(false),
      }),
    }
  }
}

impl WorkerPool {
  /// Creates a new `WorkerPool` which immediately creates `initial` workers.
  ///
  /// The pool created here can be used over a long period of time, and it
  /// will be initially primed with `initial` workers. Currently workers are
  /// never released or gc'd until the whole pool is destroyed.
  ///
  /// # Errors
  ///
  /// Returns any error that may happen while a JS web worker is created and a
  /// message is sent to it.
  pub fn new() -> WorkerPool {
    WorkerPool::default()
  }

  /// Unconditionally spawns a new worker
  ///
  /// The worker isn't registered with this `WorkerPool` but is capable of
  /// executing work for this wasm module.
  ///
  /// # Errors
  ///
  /// Returns any error that may happen while a JS web worker is created and a
  /// message is sent to it.
  fn create_worker(&self) -> Result<Worker, JsValue> {
    *self.pool_state.total_workers_count.borrow_mut() += 1;
    let script = format!(
      "
      import init, * as wasmBindings from '{}';
      globalThis.wasmBindings = wasmBindings;
      self.onmessage = event => {{
        let initialised = init(event.data).catch(err => {{
          // Propagate to main `onerror`:
          setTimeout(() => {{
            throw err;
          }});
          // Rethrow to keep promise rejected
          // and prevent execution of further commands:
          throw err;
        }});

        self.onmessage = async event => {{
          // This will queue further commands up
          // until the module is fully initialised:
          await initialised;
          wasmBindings.task_worker_entry_point(event.data);
        }};
      }};
      ",
      get_mina_live_script_path().unwrap()
    );
    let blob_property_bag = BlobPropertyBag::new();
    blob_property_bag.set_type("text/javascript");
    let blob = Blob::new_with_blob_sequence_and_options(
      &Array::from_iter([JsValue::from(script)]).into(),
      &blob_property_bag,
    )?;
    let url = Url::create_object_url_with_blob(&blob)?;
    let options = WorkerOptions::new();
    options.set_type(WorkerType::Module);
    let worker = Worker::new_with_options(&url, &options)?;

    // With a worker spun up send it the module/memory so it can start
    // instantiating the wasm module. Later it might receive further
    // messages about code to run on the wasm module.
    let worker_init = Object::new();
    Reflect::set(&worker_init, &JsString::from("module_or_path"), &module())?;
    Reflect::set(&worker_init, &JsString::from("memory"), &memory())?;
    worker.post_message(&worker_init)?;

    Ok(worker)
  }

  /// Fetches a worker from this pool, creating one if necessary.
  ///
  /// This will attempt to pull an already-spawned web worker from our cache
  /// if one is available, otherwise it will spawn a new worker and return the
  /// newly spawned worker.
  ///
  /// # Errors
  ///
  /// Returns any error that may happen while a JS web worker is created and a
  /// message is sent to it.
  fn get_worker(&self) -> Result<Worker, JsValue> {
    match self.pool_state.idle_workers.borrow_mut().pop() {
      Some(managed_worker) => Ok(managed_worker.worker),
      None => self.create_worker(),
    }
  }

  /// Executes the work `f` in a web worker, spawning a web worker if
  /// necessary.
  ///
  /// This will acquire a web worker and then send the closure `f` to the
  /// worker to execute. The worker won't be usable for anything else while
  /// `f` is executing, and no callbacks are registered for when the worker
  /// finishes.
  ///
  /// # Errors
  ///
  /// Returns any error that may happen while a JS web worker is created and a
  /// message is sent to it.
  fn execute(&self, task: Task) -> Result<Worker, JsValue> {
    let worker = self.get_worker()?;
    let work = Box::new(task);
    let ptr = Box::into_raw(work);
    match worker.post_message(&JsValue::from(ptr as u32)) {
      Ok(()) => Ok(worker),
      Err(error) => {
        unsafe {
          drop(Box::from_raw(ptr));
        }
        Err(error)
      }
    }
  }

  /// Configures an `onmessage` callback for the `worker` specified for the
  /// web worker to be reclaimed and re-inserted into this pool when a message
  /// is received.
  ///
  /// Currently this `WorkerPool` abstraction is intended to execute one-off
  /// style work where the work itself doesn't send any notifications and
  /// whatn it's done the worker is ready to execute more work. This method is
  /// used for all spawned workers to ensure that when the work is finished
  /// the worker is reclaimed back into this pool.
  fn reclaim_on_message(&self, worker: Worker) {
    let pool_state = Rc::downgrade(&self.pool_state);
    let worker2 = worker.clone();
    let reclaim_slot = Rc::new(RefCell::new(None));
    let slot2 = reclaim_slot.clone();
    let reclaim = Closure::<dyn FnMut(_)>::new(move |event: Event| {
      if let Some(error) = event.dyn_ref::<ErrorEvent>() {
        JsValue::from_str(&error.message()).log_error("RECLAIM_EVENT");
        // TODO: this probably leaks memory somehow? It's sort of
        // unclear what to do about errors in workers right now.
        return;
      }

      // If this is a completion event then can deallocate our own
      // callback by clearing out `slot2` which contains our own closure.
      if let Some(_msg) = event.dyn_ref::<MessageEvent>() {
        if let Some(pool_state) = pool_state.upgrade() {
          pool_state.push_worker(worker2.clone());
        }
        *slot2.borrow_mut() = None;
        return;
      }

      // Unhandled worker event exists.
      JsValue::from_str(&format!("{:?}", event)).log_error("UNHANDLED_RECLAIM");
    });
    worker.set_onmessage(Some(reclaim.as_ref().unchecked_ref()));
    *reclaim_slot.borrow_mut() = Some(reclaim);
  }
}

impl WorkerPool {
  /// Executes `f` in a web worker.
  ///
  /// This pool manages a set of web workers to draw from, and `f` will be
  /// spawned quickly into one if the worker is idle. If no idle workers are
  /// available then a new web worker will be spawned.
  ///
  /// Once `f` returns the worker assigned to `f` is automatically reclaimed
  /// by this `WorkerPool`. This method provides no method of learning when
  /// `f` completes, and for that you'll need to use `run_notify`.
  ///
  /// # Errors
  ///
  /// If an error happens while spawning a web worker or sending a message to
  /// a web worker, that error is returned.
  fn run(&self, task: Task) -> Result<(), JsValue> {
    let worker = self.execute(task)?;
    self.reclaim_on_message(worker);
    Ok(())
  }

  pub fn remove_inactive_workers(&self) {
    let mut idle_workers = self.pool_state.idle_workers.borrow_mut();
    let current_timestamp = now();
    idle_workers.retain(|managed_worker| {
      let deactivated_time = *managed_worker.deactivated_time.borrow();
      let passed_time = current_timestamp - deactivated_time;
      let is_active = passed_time < 10000.0; // 10 seconds
      if !is_active {
        managed_worker.worker.terminate();
        *self.pool_state.total_workers_count.borrow_mut() -= 1;
      }
      is_active
    });
  }

  pub fn flush_queued_tasks(&self) {
    while *self.pool_state.total_workers_count.borrow() < MAX_WORKERS {
      let mut queued_tasks = self.pool_state.queued_tasks.borrow_mut();
      let queued_task = match queued_tasks.pop_front() {
        Some(inner) => inner,
        None => break,
      };
      self.run(queued_task).log_error("FLUSH_QUEUED_TASKS");
    }
  }

  pub fn queue_task<C>(&self, callable: C)
  where
    C: Future<Output = ()> + 'static,
  {
    let mut queued_tasks = self.pool_state.queued_tasks.borrow_mut();
    queued_tasks.push_back(Task {
      callable: Box::pin(callable),
    });
    drop(queued_tasks);
    self.flush_queued_tasks();
  }

  pub fn start_managing(&self) {
    *self.pool_state.managing.borrow_mut() = true;
  }

  pub fn stop_managing(&self) {
    *self.pool_state.managing.borrow_mut() = false;
  }

  pub fn is_managing(&self) -> bool {
    *self.pool_state.managing.borrow()
  }

  pub fn require_stop(&self) {
    *self.pool_state.stop_requested.borrow_mut() = true;
  }

  pub fn cancel_stop_request(&self) {
    *self.pool_state.stop_requested.borrow_mut() = false;
  }

  pub fn stop_requested(&self) -> bool {
    *self.pool_state.stop_requested.borrow_mut()
  }

  pub fn get_worker_count(&self) -> usize {
    *self.pool_state.total_workers_count.borrow()
  }
}

impl PoolState {
  fn push_worker(&self, worker: Worker) {
    worker.set_onmessage(Some(self.callback.as_ref().unchecked_ref()));
    worker.set_onerror(Some(self.callback.as_ref().unchecked_ref()));
    let mut workers = self.idle_workers.borrow_mut();
    for prev in workers.iter() {
      let prev: &JsValue = &prev.worker;
      let worker: &JsValue = &worker;
      assert!(prev != worker);
    }
    workers.push(ManagedWorker {
      deactivated_time: RefCell::new(now()),
      worker,
    });
  }
}

/// Entry point invoked by JavaScript in a worker.
#[wasm_bindgen]
pub async fn task_worker_entry_point(ptr: u32) -> Result<(), JsValue> {
  console_error_panic_hook::set_once();
  let ptr = unsafe { Box::from_raw(ptr as *mut Task) };
  let global = global().unchecked_into::<DedicatedWorkerGlobalScope>();
  (ptr.callable).await;
  global.post_message(&JsValue::undefined())?;
  Ok(())
}

pub fn set_mina_live_script_path(buffer: String) {
  MINA_LIVE_SCRIPT_PATH.with(|cell| *cell.borrow_mut() = Some(buffer));
}

pub fn get_mina_live_script_path() -> Option<String> {
  MINA_LIVE_SCRIPT_PATH.with(|cell| cell.borrow().clone())
}
