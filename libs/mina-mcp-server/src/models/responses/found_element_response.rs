use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct FoundElementResponse {
  pub element: Option<DiagramElementType>,
}

impl Default for FoundElementResponse {
  fn default() -> Self {
    Self { element: None }
  }
}
