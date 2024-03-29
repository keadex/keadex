pub mod diagram_plantuml;
pub mod diagram_spec;
pub mod graphic;

use crate::model::diagram::{diagram_plantuml::DiagramPlantUML, diagram_spec::DiagramSpec};
use bomboni_wasm::Wasm;
use serde::{Deserialize, Serialize};
use strum::{Display, EnumIter, EnumString};
use ts_rs::TS;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(
  Serialize, Deserialize, Display, Debug, EnumString, Clone, EnumIter, Hash, Eq, PartialEq,
)]
pub enum C4ElementType {
  #[serde(rename = "Person")]
  #[strum(serialize = "Person")]
  Person,
  #[serde(rename = "SoftwareSystem")]
  #[strum(serialize = "SoftwareSystem")]
  SoftwareSystem,
  #[serde(rename = "Container")]
  #[strum(serialize = "Container")]
  Container,
  #[serde(rename = "Component")]
  #[strum(serialize = "Component")]
  Component,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(
  Serialize, Deserialize, Display, Debug, EnumString, Clone, EnumIter, Hash, Eq, PartialEq, Wasm,
)]
#[wasm(wasm_abi)]
pub enum DiagramType {
  #[serde(rename = "SYSTEM_CONTEXT")]
  #[strum(serialize = "SYSTEM_CONTEXT")]
  SystemContext,
  #[serde(rename = "CONTAINER")]
  #[strum(serialize = "CONTAINER")]
  Container,
  #[serde(rename = "COMPONENT")]
  #[strum(serialize = "COMPONENT")]
  Component,
  #[serde(rename = "SYSTEM_LANDSCAPE")]
  #[strum(serialize = "SYSTEM_LANDSCAPE")]
  SystemLadscape,
  #[serde(rename = "DYNAMIC")]
  #[strum(serialize = "DYNAMIC")]
  Dynamic,
  #[serde(rename = "DEPLOYMENT")]
  #[strum(serialize = "DEPLOYMENT")]
  Deployment,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug)]
#[wasm_bindgen(getter_with_clone)]
pub struct Diagram {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub diagram_name: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub diagram_type: Option<DiagramType>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub diagram_spec: Option<DiagramSpec>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub diagram_plantuml: Option<DiagramPlantUML>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub raw_plantuml: Option<String>,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../apps/keadex-mina/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Display, Debug, EnumString, Clone, EnumIter)]
pub enum DiagramFormat {
  #[serde(rename = "png")]
  #[strum(serialize = "png")]
  Png,
  #[serde(rename = "jpeg")]
  #[strum(serialize = "jpeg")]
  Jpeg,
}
