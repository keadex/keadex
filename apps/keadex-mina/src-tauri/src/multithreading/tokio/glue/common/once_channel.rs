use std::future::Future;
use std::pin::Pin;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::task::{Context, Poll, Waker};

pub fn once_channel<T>() -> (OnceSender<T>, OnceReceiver<T>) {
  let notified = Arc::new(AtomicBool::new(false));
  let value = Arc::new(Mutex::new(None));
  let waker = Arc::new(Mutex::new(None));

  let sender = OnceSender {
    notified: notified.clone(),
    value: value.clone(),
    waker: waker.clone(),
  };
  let receiver = OnceReceiver {
    notified,
    value,
    waker,
  };

  (sender, receiver)
}

#[derive(Clone)]
pub struct OnceSender<T> {
  notified: Arc<AtomicBool>,
  value: Arc<Mutex<Option<T>>>,
  waker: Arc<Mutex<Option<Waker>>>,
}

impl<T> OnceSender<T> {
  pub fn send(&self, value: T) {
    if let Ok(mut guard) = self.value.lock() {
      guard.replace(value);
      self.notified.store(true, Ordering::SeqCst);
    }
    if let Ok(mut guard) = self.waker.lock() {
      if let Some(waker) = guard.take() {
        waker.wake();
      }
    }
  }
}

pub struct OnceReceiver<T> {
  notified: Arc<AtomicBool>,
  value: Arc<Mutex<Option<T>>>,
  waker: Arc<Mutex<Option<Waker>>>,
}

impl<T> OnceReceiver<T> {
  pub fn is_done(&self) -> bool {
    self.notified.load(Ordering::SeqCst)
  }
}

impl<T> Future for OnceReceiver<T> {
  type Output = T;
  fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
    if self.notified.load(Ordering::SeqCst) {
      if let Ok(mut guard) = self.value.lock() {
        if let Some(value) = guard.take() {
          return Poll::Ready(value);
        }
      }
    }
    if let Ok(mut guard) = self.waker.lock() {
      guard.replace(cx.waker().clone());
    }
    Poll::Pending
  }
}
