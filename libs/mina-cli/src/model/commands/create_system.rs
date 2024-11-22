use clap::Parser;
use keadex_mina::model::c4_element::software_system::SystemType;

#[derive(Parser, Debug)]
pub struct CreateSystem {
  #[arg(long)]
  pub alias: String,
  #[arg(long)]
  pub label: String,
  #[arg(long)]
  pub system_type: SystemType,
  #[arg(long)]
  pub description: Option<String>,
  #[arg(long)]
  pub link: Option<String>,
  #[arg(long)]
  pub notes: Option<String>,
}
