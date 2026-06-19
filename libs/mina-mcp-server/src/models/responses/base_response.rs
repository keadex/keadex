use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct BaseResponse {
  pub success: bool,
  pub msg: Option<String>,
}

impl Default for BaseResponse {
  fn default() -> Self {
    BaseResponse {
      success: true,
      msg: None,
    }
  }
}
