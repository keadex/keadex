use crate::api::filesystem::CrossFile;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::DAO;
use crate::model::c4_element::component::Component;
use std::collections::HashMap;

pub const FILE_NAME: &str = "components.json";

/**
Allows to read/write Components elements' data from/to the file system.
*/
pub struct ComponentDAO {
  opened_files: HashMap<String, Box<dyn CrossFile>>,
}

impl Default for ComponentDAO {
  fn default() -> Self {
    ComponentDAO {
      opened_files: HashMap::new(),
    }
  }
}

impl DAO for ComponentDAO {}

impl FileSystemDAO<Component> for ComponentDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, Box<dyn CrossFile>> {
    &mut self.opened_files
  }
}
