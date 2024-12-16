use clap::Parser;

#[derive(Parser, Debug)]
pub struct SearchDiagramElement {
  /// Alias of the architectural element to search.
  #[arg(long)]
  pub alias: String,
}
