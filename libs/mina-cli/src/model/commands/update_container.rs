use clap::Parser;
use keadex_mina::model::c4_element::container::ContainerType;

#[derive(Parser, Debug)]
pub struct UpdateContainer {
  #[arg(long)]
  pub alias: String,
  #[arg(long)]
  pub new_label: Option<String>,
  #[arg(long)]
  pub new_container_type: Option<ContainerType>,
  #[arg(long)]
  pub new_technology: Option<String>,
  #[arg(long)]
  pub new_description: Option<String>,
  #[arg(long)]
  pub new_link: Option<String>,
  #[arg(long)]
  pub new_notes: Option<String>,
}
