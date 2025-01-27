pub mod project_library_dao;
pub mod project_settings_dao;

use crate::dao::DAO;

/**
Specialization of the DAO to interact with data stored in an in-memory storage.
*/
pub trait InMemoryDAO<T>: DAO {
  fn save(&self, data: &T) -> impl std::future::Future<Output = ()> + Send;

  fn delete(&self, data: &T) -> impl std::future::Future<Output = ()> + Send;

  fn get(&mut self) -> impl std::future::Future<Output = T> + Send;
}
