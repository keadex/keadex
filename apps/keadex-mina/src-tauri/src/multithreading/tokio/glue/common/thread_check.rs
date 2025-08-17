use std::cell::LazyCell;
use web_sys::window;

thread_local! {
  pub static IS_MAIN_THREAD: LazyCell<bool> =
    LazyCell::new(|| window().is_some());
}

pub fn is_main_thread() -> bool {
  let mut is_main: bool = false;
  IS_MAIN_THREAD.with(|cell| {
    is_main = **cell;
  });
  is_main
}
