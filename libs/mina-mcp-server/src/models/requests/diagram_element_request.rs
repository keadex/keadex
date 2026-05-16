use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema)]
pub struct DiagramElementRequest {
  #[serde(rename = "diagramElementAlias")]
  pub diagram_element_alias: String,
}
