/*!
Model representing a node of a graph.
*/

use crate::model::diagram::diagram_plantuml::DiagramElementType;
use crate::model::graph::graph::Graph;
use crate::model::graph::node_handle::NodeHandle;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Node {
  pub alias: String,
  pub element_type: DiagramElementType,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub handle: Option<NodeHandle>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub subgraph: Option<Graph>,
}

#[derive(Debug, Clone)]
pub enum NodePosition {
  Top,
  TopRight,
  Right,
  BottomRight,
  Bottom,
  BottomLeft,
  Left,
  TopLeft,
  Center,
}

impl Node {
  pub fn new(alias: &str, element_type: DiagramElementType, subgraph: Option<Graph>) -> Self {
    Self {
      alias: String::from(alias),
      element_type,
      handle: None,
      subgraph,
    }
  }
}
