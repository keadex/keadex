use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use schemars::JsonSchema;
use serde::Deserialize;

#[derive(Debug, Deserialize, JsonSchema)]
pub struct GeneratePlantUmlCodeElementsRequest {
  #[serde(rename = "diagramElements")]
  pub diagram_elements: Vec<DiagramElementType>,
  pub indentation: Option<usize>,
}
