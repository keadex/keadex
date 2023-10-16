use serde::{Deserialize, Serialize};
use crate::model::{project_library::ProjectLibrary, project_settings::ProjectSettings};
use ts_rs::TS;

#[derive(TS)]
#[ts(export, export_to = "../../../apps/keadex-mina/src/models/autogenerated/")]
#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Project {
  pub project_settings: ProjectSettings,
  pub project_library: ProjectLibrary,
}
