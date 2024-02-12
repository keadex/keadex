#[cfg(feature = "desktop")]
use crate::dao::filesystem::FileSystemDAO;
#[cfg(feature = "desktop")]
use crate::dao::DAO;
#[cfg(feature = "desktop")]
use crate::model::diagram::diagram_spec::DiagramSpec;
#[cfg(feature = "desktop")]
use std::collections::HashMap;
#[cfg(feature = "desktop")]
use std::fs::File;

pub const FILE_NAME: &str = "diagram.spec.json";

/**
Allows to read/write Diagram's Specifications data from/to the file system.
*/
#[cfg(feature = "desktop")]
pub struct DiagramSpecDAO {
  opened_files: HashMap<String, File>,
}

#[cfg(feature = "desktop")]
impl Default for DiagramSpecDAO {
  fn default() -> Self {
    DiagramSpecDAO {
      opened_files: HashMap::new(),
    }
  }
}

#[cfg(feature = "desktop")]
impl DAO for DiagramSpecDAO {}

#[cfg(feature = "desktop")]
impl FileSystemDAO<DiagramSpec> for DiagramSpecDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, File> {
    &mut self.opened_files
  }
}
