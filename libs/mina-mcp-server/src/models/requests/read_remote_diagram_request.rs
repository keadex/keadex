use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema)]
pub struct ReadRemoteDiagramRequest {
  #[serde(rename = "projectRootUrl")]
  pub project_root_url: String,
  #[serde(rename = "diagramUrl")]
  pub diagram_url: String,
  #[serde(rename = "ghToken")]
  pub gh_token: Option<String>,
}
