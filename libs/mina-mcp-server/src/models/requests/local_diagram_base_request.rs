use clap::Parser;
use keadex_mina::model::diagram::DiagramType;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema, Parser)]
pub struct LocalDiagramBaseRequest {
  #[arg(long)]
  #[serde(rename = "diagramName")]
  pub diagram_name: String,

  #[arg(long)]
  #[serde(rename = "diagramType")]
  pub diagram_type: DiagramType,
}
