use clap::Parser;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema, Parser)]
pub struct ReadRemoteDiagramRequest {
  #[arg(long)]
  #[serde(rename = "projectRootUrl")]
  pub project_root_url: String,

  #[arg(long)]
  #[serde(rename = "diagramUrl")]
  pub diagram_url: String,

  #[arg(long)]
  #[serde(rename = "ghToken")]
  pub gh_token: Option<String>,
}
