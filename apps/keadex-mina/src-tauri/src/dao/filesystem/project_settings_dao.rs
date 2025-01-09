#[cfg(cross)]
use crate::dao::filesystem::FileSystemDAO;
#[cfg(cross)]
use crate::dao::DAO;
#[cfg(cross)]
use crate::model::project_settings::ProjectSettings;
#[cfg(cross)]
use std::collections::HashMap;
#[cfg(cross)]
use std::fs::File;

pub const FILE_NAME: &str = "mina.json";

/**
Allows to read/write Project Settings data from/to the file system.
*/
#[cfg(cross)]
pub struct ProjectSettingsDAO {
  opened_files: HashMap<String, File>,
}

#[cfg(cross)]
impl Default for ProjectSettingsDAO {
  fn default() -> Self {
    ProjectSettingsDAO {
      opened_files: HashMap::new(),
    }
  }
}

#[cfg(cross)]
impl DAO for ProjectSettingsDAO {}

#[cfg(cross)]
impl FileSystemDAO<ProjectSettings> for ProjectSettingsDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, File> {
    &mut self.opened_files
  }
}
