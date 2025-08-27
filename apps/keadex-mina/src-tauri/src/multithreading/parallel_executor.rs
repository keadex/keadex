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
  pub tasks: Vec<Fut>,
}

impl<Fut> Default for ParallelExecutor<Fut>
where
  Fut: MinaFuture,
{
  fn default() -> Self {
    Self::new()
  }
}

impl<Fut> ParallelExecutor<Fut>
where
  Fut: MinaFuture,
{
  pub fn new() -> Self {
    Self { tasks: vec![] }
  }

  pub fn add(&mut self, task: Fut) {
    self.tasks.push(task);
  }

  pub fn is_empty(&self) -> bool {
    self.tasks.is_empty()
  }

  pub fn len(&self) -> usize {
    self.tasks.len()
  }

  pub fn clear(&mut self) {
    self.tasks.clear();
  }

  pub async fn join_all(self) -> Vec<Result<bool, MinaError>> {
    #[cfg(desktop)]
    {
      // log::debug!("Start joining {} tasks", self.tasks.len());
      // let join_time = std::time::Instant::now();
      let mut handles = futures::stream::FuturesOrdered::new();
      for task in self.tasks {
        handles.push_back(tauri::async_runtime::spawn(task));
      }
      let mut results = vec![];
      while let Some(finished_task) = handles.next().await {
        match finished_task {
          Err(_e) => { /* e is a JoinError - the task has panicked */ }
          Ok(result) => {
            results.push(result);
          }
        }
      }
      // log::debug!("End joining {}ms", join_time.elapsed().as_millis());
      return results;
    }
    #[cfg(web)]
    {
      use crate::multithreading::tokio::glue::task::spawn_blocking;

      // log::debug!("Start joining {} tasks", self.tasks.len());
      // let join_time = std::time::Instant::now();
      let mut handles = futures::stream::FuturesOrdered::new();
      for task in self.tasks {
        handles.push_back(spawn_blocking(async {
          return task.await;
        }))
      }
      let mut results = vec![];
      while let Some(finished_task) = handles.next().await {
        match finished_task {
          Err(_e) => { /* e is a JoinError - the task has panicked */ }
          Ok(result) => {
            results.push(result);
          }
        }
      }
      // log::debug!("End joining {}ms", join_time.elapsed().as_millis());
      return results;
    }
  }
}
