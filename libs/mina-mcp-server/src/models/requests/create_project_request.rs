use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema)]
pub struct CreateProjectRequest {
  pub root: String,
  pub name: String,
  pub description: String,
  pub version: String,
}
