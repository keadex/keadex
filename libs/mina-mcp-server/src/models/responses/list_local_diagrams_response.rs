use keadex_mina::model::diagram::DiagramType;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct ListLocalDiagramsResponse {
  pub diagrams: HashMap<DiagramType, Vec<String>>,
}
