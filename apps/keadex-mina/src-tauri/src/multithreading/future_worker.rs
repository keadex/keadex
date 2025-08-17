// use gloo_worker::{HandlerId, Worker, WorkerScope};

// pub struct FutureWorker;

// impl Worker for FutureWorker {
//   type Input = u32;
//   type Message = ();
//   type Output = u32;

//   fn create(_scope: &WorkerScope<Self>) -> Self {
//     FutureWorker
//   }

//   fn update(&mut self, _scope: &WorkerScope<Self>, _msg: Self::Message) {}

//   fn received(&mut self, scope: &WorkerScope<Self>, msg: Self::Input, id: HandlerId) {
//     let responder = scope.clone();
//     wasm_bindgen_futures::spawn_local(async move {
//       let result = some_async_task(msg).await;
//       responder.respond(id, result);
//     });
//   }
// }

// async fn some_async_task(x: u32) -> u32 {
//   // simulate network fetch, etc.
//   // gloo_timers::future::TimeoutFuture::new(500).await;
//   x * 2
// }

use gloo_worker::oneshot::oneshot;

#[oneshot]
pub async fn FutureWorker(input: u32) -> u32 {
  input * 2
}
