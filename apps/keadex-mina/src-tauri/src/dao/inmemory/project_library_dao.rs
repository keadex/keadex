use crate::core::app::APP_STATE;
use crate::dao::inmemory::InMemoryDAO;
use crate::dao::DAO;
use crate::model::project_library::ProjectLibrary;

/**
Allows to read/write Project Library data from/to the in-memory storage.
*/
#[derive(Default)]
pub struct ProejctLibraryDAO;

impl DAO for ProejctLibraryDAO {}

impl InMemoryDAO<Option<ProjectLibrary>> for ProejctLibraryDAO {
  fn save(&self, data: &Option<ProjectLibrary>) {
    APP_STATE.get().write().unwrap().library = data.clone();
  }

  fn get(&mut self) -> Option<ProjectLibrary> {
    APP_STATE.get().read().unwrap().library.clone()
  }

  fn delete(&self, _data: &Option<ProjectLibrary>) {
    todo!()
  }
}
