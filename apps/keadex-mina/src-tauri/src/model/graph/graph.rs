/*!
Model representing a graph.
*/

use crate::model::graph::{edge::Edge, node::Node};
use crate::rendering_system::graph_render_backend::GraphRenderBackend;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Graph {
  pub nodes: HashMap<String, Node>,
  pub edges: Vec<Edge>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub graph_render_backend: Option<GraphRenderBackend>,
  pub inter_graph_edges: Vec<Edge>,
}

impl Graph {
  pub fn new(nodes: HashMap<String, Node>, edges: Vec<Edge>) -> Self {
    Self {
      nodes,
      edges,
      graph_render_backend: None,
      inter_graph_edges: vec![],
    }
  }
}
