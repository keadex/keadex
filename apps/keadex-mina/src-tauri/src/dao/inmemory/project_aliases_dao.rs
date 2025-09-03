use crate::core::app::APP_STATE;
use crate::dao::inmemory::InMemoryDAO;
use crate::dao::DAO;
use crate::model::project_alias::ProjectAlias;
use std::collections::HashMap;

/**
Allows to read/write Project Library data from/to the in-memory storage.
*/
#[derive(Default)]
pub struct ProjectAliasesDAO;

impl DAO for ProjectAliasesDAO {}

impl InMemoryDAO<Option<HashMap<String, Vec<ProjectAlias>>>> for ProjectAliasesDAO {
  async fn save(&self, data: &Option<HashMap<String, Vec<ProjectAlias>>>) {
    APP_STATE.get().write().await.project_aliases = data.clone();
  }

  async fn get(&mut self) -> Option<HashMap<String, Vec<ProjectAlias>>> {
    APP_STATE.get().read().await.project_aliases.clone()
  }

  async fn delete(&self, _data: &Option<HashMap<String, Vec<ProjectAlias>>>) {
    todo!()
  }
}
