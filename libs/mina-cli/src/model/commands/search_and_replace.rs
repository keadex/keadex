use clap::Parser;

#[derive(Parser, Debug)]
pub struct SearchAndReplace {
  #[arg(long)]
  pub text_to_search: String,
  #[arg(long)]
  pub replacement: String,
  #[arg(long)]
  pub include_diagrams: bool,
  #[arg(long)]
  pub include_library: bool,
}
