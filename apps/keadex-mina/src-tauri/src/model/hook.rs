use crate::model::diagram::Diagram;
use serde::{Deserialize, Serialize};
use strum::EnumString;
use strum_macros::Display;
use strum_macros::EnumIter;
use ts_rs::TS;

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../apps/keadex-mina/src/models/autogenerated/"
)]
#[derive(
  Serialize, Deserialize, Display, Debug, EnumString, Clone, EnumIter, Hash, Eq, PartialEq,
)]
pub enum HookType {
  #[serde(rename = "onDiagramCreated")]
  #[strum(serialize = "onDiagramCreated")]
  OnDiagramCreated,
  #[serde(rename = "onDiagramDeleted")]
  #[strum(serialize = "onDiagramDeleted")]
  OnDiagramDeleted,
  #[serde(rename = "onDiagramSaved")]
  #[strum(serialize = "onDiagramSaved")]
  OnDiagramSaved,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../apps/keadex-mina/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Display, Debug)]
pub enum HookData {
  Diagram(Diagram),
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../apps/keadex-mina/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug)]
pub struct HookPayload {
  pub hook_type: HookType,
  pub data: Option<HookData>,
}

impl Default for HookPayload {
  fn default() -> Self {
    HookPayload {
      hook_type: HookType::OnDiagramSaved,
      data: None,
    }
  }
}
