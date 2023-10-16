use crate::core::app::APP_STATE;
use crate::dao::inmemory::InMemoryDAO;
use crate::dao::DAO;
use crate::model::project_settings::ProjectSettings;

/**
Allows to read/write Project Settings data from/to the in-memory storage.
*/
#[derive(Default)]
pub struct ProjectSettingsDAO;

impl DAO for ProjectSettingsDAO {}

impl InMemoryDAO<Option<ProjectSettings>> for ProjectSettingsDAO {
  fn save(&self, data: &Option<ProjectSettings>) {
    APP_STATE.get().write().unwrap().project_settings = data.clone();
  }

  fn get(&mut self) -> Option<ProjectSettings> {
    APP_STATE.get().read().unwrap().project_settings.clone()
  }

  fn delete(&self, data: &Option<ProjectSettings>) {
    todo!()
  }
}
