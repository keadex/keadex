use clap::Parser;
use keadex_mina::model::c4_element::person::PersonType;

#[derive(Parser, Debug)]
pub struct CreatePerson {
  #[arg(long)]
  pub alias: String,
  #[arg(long)]
  pub label: String,
  #[arg(long)]
  pub person_type: PersonType,
  #[arg(long)]
  pub description: Option<String>,
  #[arg(long)]
  pub notes: Option<String>,
}
