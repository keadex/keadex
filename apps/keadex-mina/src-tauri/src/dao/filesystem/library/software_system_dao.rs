use crate::api::filesystem::CrossFile;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::DAO;
use crate::model::c4_element::software_system::SoftwareSystem;
use std::collections::HashMap;

pub const FILE_NAME: &str = "software-systems.json";

/**
Allows to read/write Software System elements' data from/to the file system.
*/
pub struct SoftwareSystemDAO {
  opened_files: HashMap<String, Box<dyn CrossFile>>,
}

impl Default for SoftwareSystemDAO {
  fn default() -> Self {
    SoftwareSystemDAO {
      opened_files: HashMap::new(),
    }
  }
}

impl DAO for SoftwareSystemDAO {}

impl FileSystemDAO<SoftwareSystem> for SoftwareSystemDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, Box<dyn CrossFile>> {
    &mut self.opened_files
  }
}
