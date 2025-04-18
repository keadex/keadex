use clap::Parser;
use keadex_mina::model::c4_element::component::ComponentType;

#[derive(Parser, Debug)]
pub struct CreateComponent {
  #[arg(long)]
  pub alias: String,
  #[arg(long)]
  pub label: String,
  #[arg(long)]
  pub component_type: ComponentType,
  #[arg(long)]
  pub technology: String,
  #[arg(long)]
  pub description: Option<String>,
  #[arg(long)]
  pub link: Option<String>,
  #[arg(long)]
  pub notes: Option<String>,
}
