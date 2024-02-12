/*!
Model representing the position of a diagram's entity.
*/

use serde::{Deserialize, Serialize};
use ts_rs::TS;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug, Clone)]
#[wasm_bindgen]
pub struct Position {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub left: Option<f64>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub top: Option<f64>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub z_index: Option<i32>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub angle: Option<f64>,
}
