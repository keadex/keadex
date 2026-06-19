use clap::Parser;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Parser, Debug, Deserialize, JsonSchema)]
pub struct SearchAndReplaceRequest {
  #[arg(long)]
  pub text_to_search: String,
  #[arg(long)]
  pub replacement: String,
  #[arg(long)]
  pub include_diagrams: bool,
  #[arg(long)]
  pub include_library: bool,
}
