/*!
  Mina's state
  Manages the internal state of Mina.
*/

use crate::model::project_alias::ProjectAlias;
use crate::model::project_library::ProjectLibrary;
use crate::model::project_settings::ProjectSettings;
use std::collections::HashMap;

#[derive(Default)]
pub struct State {
  pub project_settings: Option<ProjectSettings>,
  pub library: Option<ProjectLibrary>,
  pub project_aliases: Option<HashMap<String, Vec<ProjectAlias>>>,
}
