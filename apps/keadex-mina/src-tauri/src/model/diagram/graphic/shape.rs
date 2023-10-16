/*!
Model representing a shape drawn in a diagram.
*/

use crate::model::diagram::graphic::position::Position;
use crate::model::diagram::graphic::size::Size;
use serde::{Deserialize, Serialize};
use strum_macros::Display;
use ts_rs::TS;

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Display, Debug, Clone)]
pub enum ShapeType {
  #[serde(rename = "LINE")]
  #[strum(serialize = "LINE")]
  Line,
  #[serde(rename = "DOT")]
  #[strum(serialize = "DOT")]
  Dot,
  #[serde(rename = "TEXT")]
  #[strum(serialize = "TEXT")]
  Text,
  #[serde(rename = "TRIANGLE")]
  #[strum(serialize = "TRIANGLE")]
  Triangle,
  #[serde(rename = "RECTANGLE")]
  #[strum(serialize = "RECTANGLE")]
  Rectangle,
  #[serde(rename = "FOOTER")]
  #[strum(serialize = "FOOTER")]
  Footer,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Shape {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub shape_type: Option<ShapeType>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub position: Option<Position>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub size: Option<Size>,
}
