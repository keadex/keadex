use clap::Parser;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema, Parser)]
pub struct ValidatePlantUmlCodeRequest {
  #[arg(long)]
  #[serde(rename = "plantumlCode")]
  pub plantuml_code: String,
}
