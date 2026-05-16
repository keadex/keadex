use keadex_mina::model::diagram::Diagram;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, JsonSchema)]
pub struct ReadAllLocalDiagramsResponse {
  pub diagrams: Vec<Diagram>,
}
