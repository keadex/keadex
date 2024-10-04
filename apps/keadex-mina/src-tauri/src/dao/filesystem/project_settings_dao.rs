#[cfg(feature = "desktop")]
use crate::dao::filesystem::FileSystemDAO;
#[cfg(feature = "desktop")]
use crate::dao::DAO;
#[cfg(feature = "desktop")]
use crate::model::project_settings::ProjectSettings;
#[cfg(feature = "desktop")]
use std::collections::HashMap;
#[cfg(feature = "desktop")]
use std::fs::File;

pub const FILE_NAME: &str = "mina.json";

/**
Allows to read/write Project Settings data from/to the file system.
*/
#[cfg(feature = "desktop")]
pub struct ProjectSettingsDAO {
  opened_files: HashMap<String, File>,
}

#[cfg(feature = "desktop")]
impl Default for ProjectSettingsDAO {
  fn default() -> Self {
    ProjectSettingsDAO {
      opened_files: HashMap::new(),
    }
  }
}

#[cfg(feature = "desktop")]
impl DAO for ProjectSettingsDAO {}

#[cfg(feature = "desktop")]
impl FileSystemDAO<ProjectSettings> for ProjectSettingsDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, File> {
    &mut self.opened_files
  }
}
