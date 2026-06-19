use clap::Parser;
use keadex_mina::model::c4_element::software_system::SystemType;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Parser, Debug, Deserialize, JsonSchema)]
pub struct UpdateSystemRequest {
  #[arg(long)]
  pub alias: String,
  #[arg(long)]
  pub new_label: Option<String>,
  #[arg(long)]
  pub new_system_type: Option<SystemType>,
  #[arg(long)]
  pub new_description: Option<String>,
  #[arg(long)]
  pub new_link: Option<String>,
  #[arg(long)]
  pub new_notes: Option<String>,
}
