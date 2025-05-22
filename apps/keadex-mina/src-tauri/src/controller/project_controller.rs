use crate::core::project_initializer::{create_empty_project, load_project, unload_project};
use crate::error_handling::mina_error::MinaError;
use crate::helper::project_helper;
use crate::model::project::Project;
use crate::model::project_settings::ProjectSettings;
use crate::repository::project_repository;
use keadex_mina_macro::web_controller;

/**
Creates an empty Mina project.
# Arguments
  * `project_settings` - Settings of the project to create.
*/
#[cfg_attr(desktop, tauri::command)]
pub async fn create_project(
  project_settings: ProjectSettings,
) -> Result<ProjectSettings, MinaError> {
  log::info!("Create project");
  Ok(create_empty_project(project_settings).await?)
}

/**
Opens a project, validates its structure and initialize the internal state of the application with
all the project's settings, by locking the files to guarantee the synchronization.
Returns data of the opened project.
# Arguments
  * `root` - Path of the root's project.
*/
#[cfg_attr(desktop, tauri::command)]
pub async fn open_project(root: &str) -> Result<Project, MinaError> {
  log::info!("Open project {}", root);
  load_project(root).await
}

/**
Closes a project and clears the internal state of the application, by unlocking the files.
# Arguments
  * `root` - Path of the root's project.
*/
#[cfg_attr(desktop, tauri::command)]
pub async fn close_project(root: &str) -> Result<bool, MinaError> {
  log::info!("Close project {}", root);
  unload_project(root).await?;
  Ok(true)
}

/**
Saves project settings.
# Arguments
  * `project_settings` - Project settings.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn save_project_settings(
  project_settings: ProjectSettings,
) -> Result<ProjectSettings, MinaError> {
  log::info!("Save project settings");
  Ok(project_repository::save_project_settings(project_settings).await?)
}

/**
Generates the full project settings URL.
# Arguments
  * `project_root_url` - URL of the project's root
*/
#[cfg_attr(desktop, tauri::command)]
pub async fn project_settings_url(project_root_url: &str) -> Result<String, MinaError> {
  Ok(project_helper::project_settings_url(project_root_url))
}
