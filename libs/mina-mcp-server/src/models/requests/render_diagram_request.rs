use keadex_mina::model::{
  diagram::Diagram, themes::diagrams_theme_settings::DiagramsThemeSettings,
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, JsonSchema)]
pub struct RenderDiagramRequest {
  pub diagram: Diagram,
  #[serde(rename = "diagramsThemeSettings")]
  pub diagrams_theme_settings: Option<DiagramsThemeSettings>,
}
