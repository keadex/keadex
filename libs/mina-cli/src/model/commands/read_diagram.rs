use clap::Parser;
use keadex_mina::model::diagram::DiagramType;

#[derive(Parser, Debug)]
pub struct ReadDiagram {
  /// Name of the diagram in lowercase and kebab-case (e.g., "my-diagram").
  #[arg(long)]
  pub diagram_name: String,
  /// Type of the diagram in uppercase and snake-case (e.g., "SYSTEM_CONTEXT").
  #[arg(long)]
  pub diagram_type: DiagramType,
}
