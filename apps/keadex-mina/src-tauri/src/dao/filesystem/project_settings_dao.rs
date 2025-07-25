use crate::api::filesystem::CrossFile;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::DAO;
use crate::model::project_settings::ProjectSettings;
use std::collections::HashMap;

pub const FILE_NAME: &str = "mina.json";

/**
Allows to read/write Project Settings data from/to the file system.
*/
pub struct ProjectSettingsDAO {
  opened_files: HashMap<String, Box<dyn CrossFile>>,
}

impl Default for ProjectSettingsDAO {
  fn default() -> Self {
    ProjectSettingsDAO {
      opened_files: HashMap::new(),
    }
  }
}

impl DAO for ProjectSettingsDAO {}

impl FileSystemDAO<ProjectSettings> for ProjectSettingsDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, Box<dyn CrossFile>> {
    &mut self.opened_files
  }
}
