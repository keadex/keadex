pub mod project_library_dao;
pub mod project_settings_dao;

use crate::dao::DAO;

/**
Specialization of the DAO to interact with data stored in an in-memory storage.
*/
pub trait InMemoryDAO<T>: DAO {
  fn save(&self, data: &T);

  fn delete(&self, data: &T);

  fn get(&mut self) -> T;
}
