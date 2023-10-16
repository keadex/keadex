/*!
Project Repository.
Module which exposes functions to access/alter project's data.
Under the hood it uses DAOs.
*/

use std::path::Path;

use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::{ProjectSettingsFsDAO, ProjectSettingsIMDAO};
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::helper::project_helper::project_settings_path;
use crate::model::project_settings::ProjectSettings;
use crate::resolve_to_write;

pub fn save_project_settings(
  updated_project_settings: ProjectSettings,
) -> Result<ProjectSettings, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let stored_project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();

  // Make sure path of the root's project has not been altered
  let patched_project_settings = Some(ProjectSettings {
    root: stored_project_settings.root.clone(),
    ..updated_project_settings
  });

  // Update project settings in memory state
  resolve_to_write!(store, ProjectSettingsIMDAO).save(&patched_project_settings);

  // Update project settings in fs
  resolve_to_write!(store, ProjectSettingsFsDAO).save(
    &patched_project_settings.unwrap(),
    Path::new(&project_settings_path(&stored_project_settings.root)),
    false
  )?;

  let updated_project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  Ok(updated_project_settings)
}
