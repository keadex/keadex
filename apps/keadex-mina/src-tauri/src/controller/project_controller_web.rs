use crate::api::filesystem::web_fs::DEFAULT_WEB_ROOT;
use crate::controller::project_controller;
use crate::core::app::App;
use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::FileSystemAPI;
use crate::error_handling::mina_error::MinaError;
use crate::model::project::Project;
use crate::model::project_settings::ProjectSettings;
use crate::multithreading::tokio::glue::task::pool::set_mina_live_script_path;
use crate::resolve_to_write;
use keadex_mina_macro::web_controller;
use wasm_bindgen::JsValue;
use web_sys::console;

#[cfg_attr(web, web_controller)]
pub fn init_app(mina_live_script_path: String) -> Result<bool, MinaError> {
  App::init();
  set_mina_live_script_path(mina_live_script_path);
  Ok(true)
}

#[cfg_attr(web, web_controller(without_input_transformation(dir_handle)))]
pub async fn create_project(
  project_settings: ProjectSettings,
  dir_handle: Option<web_sys::FileSystemDirectoryHandle>,
) -> Result<ProjectSettings, MinaError> {
  console::log_1(&JsValue::from("Create project web"));
  let mut project_settings_web = project_settings.clone();
  project_settings_web.root = DEFAULT_WEB_ROOT.to_string();
  let store = ROOT_RESOLVER.get().read().await;
  resolve_to_write!(store, FileSystemAPI)
    .await
    .root_dir_handle = dir_handle;
  project_controller::create_project(project_settings_web).await
}

#[cfg_attr(web, web_controller(without_input_transformation))]
pub async fn open_project(
  dir_handle: Option<web_sys::FileSystemDirectoryHandle>,
) -> Result<Project, MinaError> {
  let root = DEFAULT_WEB_ROOT;
  console::log_1(&JsValue::from(format!(
    "Open project web {} - {:?}",
    root, dir_handle,
  )));
  let store = ROOT_RESOLVER.get().read().await;
  resolve_to_write!(store, FileSystemAPI)
    .await
    .root_dir_handle = dir_handle;
  project_controller::open_project(root).await
}

#[cfg_attr(web, web_controller)]
pub async fn close_project() -> Result<bool, MinaError> {
  let root = DEFAULT_WEB_ROOT;
  console::log_1(&JsValue::from(format!("Close project web {}", root)));
  let store = ROOT_RESOLVER.get().read().await;
  resolve_to_write!(store, FileSystemAPI)
    .await
    .root_dir_handle = None;
  project_controller::close_project(root).await
}
