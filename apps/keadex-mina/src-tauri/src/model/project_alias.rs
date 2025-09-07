use crate::model::diagram::diagram_plantuml::DiagramElementType;
use crate::model::file_search_results::FileSearchCategory;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct ProjectAlias {
  pub alias: String,
  pub category: FileSearchCategory,
  pub element: Option<DiagramElementType>,
}
