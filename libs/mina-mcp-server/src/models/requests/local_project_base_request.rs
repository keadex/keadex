use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema)]
pub struct LocalProjectBaseRequest {
  #[serde(rename = "projectPath")]
  pub mina_project_path: String,
}
