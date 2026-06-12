use clap::Parser;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema, Parser)]
pub struct CreateProjectRequest {
  #[clap(skip)]
  pub root: String,
  /// Name of the project
  #[arg(long)]
  pub name: String,
  /// Description of the project
  #[arg(long)]
  pub description: String,
  /// Version of the project. Use semantic versioning format (e.g., "1.0.0").
  #[arg(long)]
  pub version: String,
}
