/*!
Model representing an edge of a graph.
*/

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Edge {
  pub alias: String,
  pub from: String,
  pub to: String,
}

impl Edge {
  pub fn new(alias: &str, from: &str, to: &str) -> Self {
    Self {
      alias: String::from(alias),
      from: String::from(from),
      to: String::from(to),
    }
  }
}
