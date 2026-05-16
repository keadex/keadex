use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema)]
pub struct GeneratePlantUmlCodeDiagramRequest {
  #[serde(rename = "diagramId")]
  pub diagram_id: Option<String>,
  #[serde(rename = "diagramElements")]
  pub diagram_elements: Vec<DiagramElementType>,
}
