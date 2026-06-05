use clap::Parser;
use keadex_mina::model::c4_element::person::PersonType;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Parser, Debug, Deserialize, JsonSchema)]
pub struct UpdatePersonRequest {
  #[arg(long)]
  pub alias: String,
  #[arg(long)]
  pub new_label: Option<String>,
  #[arg(long)]
  pub new_person_type: Option<PersonType>,
  #[arg(long)]
  pub new_description: Option<String>,
  #[arg(long)]
  pub new_notes: Option<String>,
}
