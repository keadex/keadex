use std::sync::Arc;
use std::task::{Wake, Waker};

pub struct NoopWaker;

impl Wake for NoopWaker {
  fn wake(self: Arc<Self>) {}
}

/// Creates a no-op `Waker` for polling.
/// "noop" stands for "no operation",
/// meaning it does nothing when executed.
pub fn noop_waker() -> Waker {
  Waker::from(Arc::new(NoopWaker))
}
