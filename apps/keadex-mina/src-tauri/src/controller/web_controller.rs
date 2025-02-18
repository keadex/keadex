use crate::controller::project_controller;
use crate::core::app::App;
use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::FileSystemAPI;
use crate::error_handling::mina_error::MinaError;
use crate::model::project::Project;
use crate::model::project_settings::ProjectSettings;
use crate::resolve_to_write;
use std::path::MAIN_SEPARATOR_STR;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn init_app() -> Result<(), MinaError> {
  App::init();
  Ok(())
}

#[wasm_bindgen]
pub async fn create_project(
  project_settings: ProjectSettings,
  dir_handle: Option<web_sys::FileSystemDirectoryHandle>,
) -> Result<ProjectSettings, MinaError> {
  log::info!("Create project web");
  let mut project_settings_web = project_settings.clone();
  project_settings_web.root = MAIN_SEPARATOR_STR.to_string();
  let store = ROOT_RESOLVER.get().read().await;
  resolve_to_write!(store, FileSystemAPI)
    .await
    .root_dir_handle = dir_handle;
  project_controller::create_project(project_settings_web).await
}

#[wasm_bindgen]
pub async fn open_project(
  dir_handle: Option<web_sys::FileSystemDirectoryHandle>,
) -> Result<Project, MinaError> {
  let root = MAIN_SEPARATOR_STR;
  log::info!("Open project web {} - {:?}", root, dir_handle);
  let store = ROOT_RESOLVER.get().read().await;
  resolve_to_write!(store, FileSystemAPI)
    .await
    .root_dir_handle = dir_handle;
  project_controller::open_project(root).await
}

#[wasm_bindgen]
pub async fn close_project() -> Result<bool, MinaError> {
  let root = MAIN_SEPARATOR_STR;
  log::info!("Close project web {}", root);
  let store = ROOT_RESOLVER.get().read().await;
  resolve_to_write!(store, FileSystemAPI)
    .await
    .root_dir_handle = None;
  project_controller::close_project(root).await
}
