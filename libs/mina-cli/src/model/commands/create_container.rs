use clap::Parser;
use keadex_mina::model::c4_element::container::ContainerType;

#[derive(Parser, Debug)]
pub struct CreateContainer {
  #[arg(long)]
  pub alias: String,
  #[arg(long)]
  pub label: String,
  #[arg(long)]
  pub container_type: ContainerType,
  #[arg(long)]
  pub technology: String,
  #[arg(long)]
  pub description: Option<String>,
  #[arg(long)]
  pub link: Option<String>,
  #[arg(long)]
  pub notes: Option<String>,
}
