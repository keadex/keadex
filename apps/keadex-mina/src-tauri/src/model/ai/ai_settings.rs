/*!
Model representing settings of the AI integration.
*/

use serde::{Deserialize, Serialize};
use ts_rs::TS;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../apps/keadex-mina/src/models/autogenerated/"
)]
#[wasm_bindgen(getter_with_clone)]
#[derive(Default, Serialize, Deserialize, Debug, Clone)]
pub struct AISettings {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub api_key: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub api_base_url: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub model: Option<String>,
}
