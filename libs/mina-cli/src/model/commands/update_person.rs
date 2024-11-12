use clap::Parser;
use keadex_mina::model::c4_element::person::PersonType;

#[derive(Parser, Debug)]
pub struct UpdatePerson {
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
