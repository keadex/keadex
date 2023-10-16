/*!
  Mina's state
  Manages the internal state of Mina.
*/

use crate::model::project_library::ProjectLibrary;
use crate::model::project_settings::ProjectSettings;

#[derive(Default)]
pub struct State {
  pub project_settings: Option<ProjectSettings>,
  pub library: Option<ProjectLibrary>,
}

impl State {}
