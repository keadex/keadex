/*!
Model representing the aggregated details of a C4 diagram.
*/

use crate::model::c4_element::add_element_tag::AddElementTag;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DiagramAggregatedDetails {
  pub aliases: Vec<String>,
  pub tags: BTreeMap<String, AddElementTag>,
}

impl Default for DiagramAggregatedDetails {
  fn default() -> Self {
    DiagramAggregatedDetails {
      aliases: vec![],
      tags: BTreeMap::new(),
    }
  }
}
