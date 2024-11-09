use clap::Parser;

#[derive(Parser, Debug)]
pub struct SearchLibraryElement {
  #[arg(long)]
  pub alias: String,
}
