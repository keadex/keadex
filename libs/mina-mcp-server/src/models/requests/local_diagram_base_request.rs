use keadex_mina::model::diagram::DiagramType;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema)]
pub struct LocalDiagramBaseRequest {
  #[serde(rename = "diagramName")]
  pub diagram_name: String,
  #[serde(rename = "diagramType")]
  pub diagram_type: DiagramType,
}
