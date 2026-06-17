use clap::Parser;

#[derive(Parser, Debug)]
pub struct DiagramElement {
  /// Alias of the architectural element.
  #[arg(long)]
  pub alias: String,
}
