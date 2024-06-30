/*!
Wrapper of the external struct "NodeHandle" of the [layout](https://github.com/nadavrot/layout) crate.
This wrapper is required to add all the annotations (derives, ts, wasm_bindgen) required by Mina.
*/

use layout::adt::dag::NodeHandle as LayoutNodeHandle;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub struct NodeHandle {
  pub idx: usize,
}

impl NodeHandle {
  pub fn from(node_handle: LayoutNodeHandle) -> Self {
    NodeHandle {
      idx: node_handle.get_index(),
    }
  }
}
