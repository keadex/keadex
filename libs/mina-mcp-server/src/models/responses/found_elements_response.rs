use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct FoundElementsResponse {
  pub aliases: Vec<String>,
}
