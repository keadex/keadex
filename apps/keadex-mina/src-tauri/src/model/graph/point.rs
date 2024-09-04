/*!
Wrapper of the external struct "Point" of the [layout](https://github.com/nadavrot/layout) crate.
This wrapper is required to add all the annotations (derives, ts, wasm_bindgen) required by Mina.
*/

use layout::core::geometry::Point as LayoutPoint;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use wasm_bindgen::prelude::*;

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
#[wasm_bindgen]
pub struct Point {
  pub x: f64,
  pub y: f64,
}

impl Point {
  pub fn from(layout_point: LayoutPoint) -> Self {
    Self {
      x: layout_point.x,
      y: layout_point.y,
    }
  }
  pub fn new(x: f64, y: f64) -> Point {
    Self { x, y }
  }
}