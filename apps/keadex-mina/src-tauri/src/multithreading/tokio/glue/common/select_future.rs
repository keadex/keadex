use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

pub struct SelectFuture<T> {
  future_a: Pin<Box<dyn Future<Output = T>>>,
  future_b: Pin<Box<dyn Future<Output = T>>>,
}

impl<T> SelectFuture<T> {
  pub fn new(
    future_a: impl Future<Output = T> + 'static,
    future_b: impl Future<Output = T> + 'static,
  ) -> Self {
    SelectFuture {
      future_a: Box::pin(future_a),
      future_b: Box::pin(future_b),
    }
  }
}

impl<T> Future for SelectFuture<T> {
  type Output = T;
  fn poll(
    mut self: Pin<&mut Self>,
    cx: &mut Context<'_>,
  ) -> Poll<Self::Output> {
    if let Poll::Ready(output) = self.future_a.as_mut().poll(cx) {
      return Poll::Ready(output);
    }
    if let Poll::Ready(output) = self.future_b.as_mut().poll(cx) {
      return Poll::Ready(output);
    }
    Poll::Pending
  }
}
