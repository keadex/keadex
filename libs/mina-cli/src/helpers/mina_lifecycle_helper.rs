use keadex_mina::core::project_initializer::{load_project, unload_project};
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::project::Project;
use std::path::PathBuf;

pub async fn init_keadex_mina(project_path: &PathBuf) -> Result<Project, MinaError> {
  let _app = keadex_mina::core::app::App::new();
  let project = load_project(project_path.to_str().unwrap()).await?;
  return Ok(project);
}

pub async fn clear_keadex_mina(project_path: &PathBuf) {
  let _ = unload_project(project_path.to_str().unwrap()).await;
}
