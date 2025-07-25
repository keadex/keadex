use crate::api::filesystem::CrossFile;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::DAO;
use crate::model::c4_element::container::Container;
use std::collections::HashMap;

pub const FILE_NAME: &str = "containers.json";

/**
Allows to read/write Containers elements' data from/to the file system.
*/
pub struct ContainerDAO {
  opened_files: HashMap<String, Box<dyn CrossFile>>,
}

impl Default for ContainerDAO {
  fn default() -> Self {
    ContainerDAO {
      opened_files: HashMap::new(),
    }
  }
}

impl DAO for ContainerDAO {}

impl FileSystemDAO<Container> for ContainerDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, Box<dyn CrossFile>> {
    &mut self.opened_files
  }
}
