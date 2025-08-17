pub mod glue;

// use tokio::task::spawn_blocking;
// use tokio_with_wasm::alias as tokio;
use crate::multithreading::tokio::glue::task::spawn_blocking;
pub async fn test_tokio() {
  log::info!("Start tokio test");
  let mut handles = vec![];
  for i in 0..4 {
    log::info!("Started worker {}", i);

    let async_join_handle = spawn_blocking(move || {
      return i * 2; // Simulate some async work
    });
    handles.push(async_join_handle);
  }
  let results = futures::future::join_all(handles).await;

  // let async_result = async_join_handle.await;
  log::info!("End tokio test. Result: {:?}", results);
}
