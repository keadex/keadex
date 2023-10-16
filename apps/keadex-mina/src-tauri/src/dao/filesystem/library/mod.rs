pub mod component_dao;
pub mod container_dao;
pub mod person_dao;
pub mod software_system_dao;

use crate::dao::filesystem::library::component_dao::FILE_NAME as COMPONENTS_FILE_NAME;
use crate::dao::filesystem::library::container_dao::FILE_NAME as CONTAINERS_FILE_NAME;
use crate::dao::filesystem::library::person_dao::FILE_NAME as PERSONS_FILE_NAME;
use crate::dao::filesystem::library::software_system_dao::FILE_NAME as SOFTWARE_SYSTEMS_FILE_NAME;

pub const LIBRARY_FOLDER: &str = "library";
pub const LIBRARY_FILE_NAMES: [&str; 4] = [
  COMPONENTS_FILE_NAME,
  CONTAINERS_FILE_NAME,
  PERSONS_FILE_NAME,
  SOFTWARE_SYSTEMS_FILE_NAME,
];
