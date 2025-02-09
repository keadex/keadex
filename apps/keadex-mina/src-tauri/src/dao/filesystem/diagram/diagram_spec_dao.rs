use crate::api::filesystem::CrossFile;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::DAO;
use crate::model::diagram::diagram_spec::DiagramSpec;
use std::collections::HashMap;

pub const FILE_NAME: &str = "diagram.spec.json";

/**
Allows to read/write Diagram's Specifications data from/to the file system.
*/
pub struct DiagramSpecDAO {
  opened_files: HashMap<String, Box<dyn CrossFile>>,
}

impl Default for DiagramSpecDAO {
  fn default() -> Self {
    DiagramSpecDAO {
      opened_files: HashMap::new(),
    }
  }
}

impl DAO for DiagramSpecDAO {}

impl FileSystemDAO<DiagramSpec> for DiagramSpecDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, Box<dyn CrossFile>> {
    &mut self.opened_files
  }
}
