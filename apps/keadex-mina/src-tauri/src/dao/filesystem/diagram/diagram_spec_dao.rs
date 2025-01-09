#[cfg(cross)]
use crate::dao::filesystem::FileSystemDAO;
#[cfg(cross)]
use crate::dao::DAO;
#[cfg(cross)]
use crate::model::diagram::diagram_spec::DiagramSpec;
#[cfg(cross)]
use std::collections::HashMap;
#[cfg(cross)]
use std::fs::File;

pub const FILE_NAME: &str = "diagram.spec.json";

/**
Allows to read/write Diagram's Specifications data from/to the file system.
*/
#[cfg(cross)]
pub struct DiagramSpecDAO {
  opened_files: HashMap<String, File>,
}

#[cfg(cross)]
impl Default for DiagramSpecDAO {
  fn default() -> Self {
    DiagramSpecDAO {
      opened_files: HashMap::new(),
    }
  }
}

#[cfg(cross)]
impl DAO for DiagramSpecDAO {}

#[cfg(cross)]
impl FileSystemDAO<DiagramSpec> for DiagramSpecDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, File> {
    &mut self.opened_files
  }
}
