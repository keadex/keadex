use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema)]
pub struct ValidatePlantUmlCodeRequest {
  #[serde(rename = "plantumlCode")]
  pub plantuml_code: String,
}
