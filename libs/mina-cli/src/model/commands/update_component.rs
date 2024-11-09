use clap::Parser;
use keadex_mina::model::c4_element::component::ComponentType;

#[derive(Parser, Debug)]
pub struct UpdateComponent {
  #[arg(long)]
  pub alias: String,
  #[arg(long)]
  pub new_label: Option<String>,
  #[arg(long)]
  pub new_component_type: Option<ComponentType>,
  #[arg(long)]
  pub new_technology: Option<String>,
  #[arg(long)]
  pub new_description: Option<String>,
  #[arg(long)]
  pub new_link: Option<String>,
  #[arg(long)]
  pub new_notes: Option<String>,
}
