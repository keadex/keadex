#![allow(dead_code)]

mod local_channel;
mod once_channel;
mod polling;
mod select_future;
mod thread_check;

#[allow(unused_imports)]
pub use local_channel::*;
#[allow(unused_imports)]
pub use once_channel::*;
#[allow(unused_imports)]
pub use polling::*;
#[allow(unused_imports)]
pub use select_future::*;
pub use thread_check::*;

use js_sys::Function;
use wasm_bindgen::prelude::{JsValue, wasm_bindgen};

#[wasm_bindgen]
extern "C" {
  #[wasm_bindgen(js_namespace = console, js_name = error)]
  pub fn error(s: &str);
  #[wasm_bindgen(js_namespace = Date, js_name = now)]
  pub fn now() -> f64;
  #[wasm_bindgen(js_namespace = globalThis, js_name = setTimeout)]
  pub fn set_timeout(callback: &Function, milliseconds: f64);
  #[wasm_bindgen(js_namespace = globalThis, js_name = setInterval)]
  pub fn set_interval(callback: &Function, milliseconds: f64) -> i32;
  #[wasm_bindgen(js_namespace = globalThis, js_name = clearInterval)]
  pub fn clear_interval(id: i32);
}

pub trait LogError {
  fn log_error(&self, code: &str);
}

impl LogError for JsValue {
  fn log_error(&self, code: &str) {
    error(&format!(
      "Error `{}` in `tokio_with_wasm`:\n{:?}",
      code, self
    ));
  }
}

impl<T> LogError for Result<T, JsValue> {
  fn log_error(&self, code: &str) {
    if let Err(js_value) = self {
      error(&format!(
        "Error `{}` in `tokio_with_wasm`:\n{:?}",
        code, js_value
      ));
    }
  }
}
