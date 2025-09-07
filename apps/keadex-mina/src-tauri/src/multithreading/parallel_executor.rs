use crate::error_handling::mina_error::MinaError;
use futures::{Future, StreamExt};

#[cfg(desktop)]
pub trait MinaFuture: Future<Output = Result<bool, MinaError>> + Send + 'static {}
#[cfg(desktop)]
impl<T: Future<Output = Result<bool, MinaError>> + Send + 'static> MinaFuture for T {}

#[cfg(web)]
pub trait MinaFuture: Future<Output = Result<bool, MinaError>> + 'static {}
#[cfg(web)]
impl<T: Future<Output = Result<bool, MinaError>> + 'static> MinaFuture for T {}

pub struct ParallelExecutor<Fut>
where
  Fut: MinaFuture,
{
  pub threads: Vec<Vec<Fut>>,
  pub tasks_per_thread: usize,
}

impl<Fut> Default for ParallelExecutor<Fut>
where
  Fut: MinaFuture,
{
  fn default() -> Self {
    Self::new(1)
  }
}

impl<Fut> ParallelExecutor<Fut>
where
  Fut: MinaFuture,
{
  pub fn new(tasks_per_thread: usize) -> Self {
    Self {
      threads: vec![],
      tasks_per_thread,
    }
  }

  pub fn add(&mut self, task: Fut) {
    if self.threads.is_empty() || self.threads.last().unwrap().len() >= self.tasks_per_thread {
      self.threads.push(vec![]);
    }
    self.threads.last_mut().unwrap().push(task);
  }

  pub fn is_empty(&self) -> bool {
    self.threads.is_empty()
  }

  pub fn threads_count(&self) -> usize {
    self.threads.len()
  }

  pub fn clear(&mut self) {
    self.threads.clear();
  }

  pub async fn join_all(self) -> Vec<Result<bool, MinaError>> {
    log::debug!("Start running {} threads", self.threads_count());

    #[cfg(desktop)]
    {
      // let join_time = std::time::Instant::now();
      let mut handles = futures::stream::FuturesOrdered::new();
      for thread in self.threads {
        handles.push_back(tauri::async_runtime::spawn(async {
          let mut results = vec![];
          for task in thread {
            results.push(task.await);
          }
          return results;
        }));
      }
      let mut results = vec![];
      while let Some(finished_task) = handles.next().await {
        match finished_task {
          Err(_e) => { /* e is a JoinError - the task has panicked */ }
          Ok(mut thread_results) => {
            results.append(&mut thread_results);
          }
        }
      }
      // log::debug!("End joining {}ms", join_time.elapsed().as_millis());
      return results;
    }
    #[cfg(web)]
    {
      use crate::multithreading::tokio::glue::task::{
        spawn_blocking, start_managing_pool, stop_managing_pool,
      };

      // let join_time = std::time::Instant::now();
      start_managing_pool();
      let mut handles = futures::stream::FuturesOrdered::new();
      for thread in self.threads {
        handles.push_back(spawn_blocking(async {
          let mut results = vec![];
          for task in thread {
            results.push(task.await);
          }
          return results;
        }))
      }
      let mut results = vec![];
      while let Some(finished_task) = handles.next().await {
        match finished_task {
          Err(_e) => { /* e is a JoinError - the task has panicked */ }
          Ok(mut thread_results) => {
            results.append(&mut thread_results);
          }
        }
      }
      stop_managing_pool();
      // log::debug!("End joining {}ms", join_time.elapsed().as_millis());
      return results;
    }
  }
}
