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
  async fn save(&self, data: &Option<ProjectSettings>) {
    APP_STATE.get().write().await.project_settings = data.clone();
  }

  async fn get(&mut self) -> Option<ProjectSettings> {
    APP_STATE.get().read().await.project_settings.clone()
  }

  async fn delete(&self, _data: &Option<ProjectSettings>) {
    todo!()
  }
}
