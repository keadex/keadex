use clap::Parser;
use keadex_mina::model::diagram::DiagramType;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema, Parser)]
pub struct FindDiagramElementRequest {
  /// Alias of the architectural element.
  #[arg(long)]
  #[serde(rename = "diagramElementAlias")]
  pub diagram_element_alias: String,

  /// Name of the diagram in lowercase and kebab-case (e.g., "my-diagram").
  #[arg(long)]
  #[serde(rename = "diagramName")]
  pub diagram_name: String,

  /// Type of the diagram in uppercase and snake-case (e.g., "SYSTEM_CONTEXT").
  #[arg(long)]
  #[serde(rename = "diagramType")]
  pub diagram_type: DiagramType,
}
