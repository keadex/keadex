use crate::core::server::KeadexMinaServer;
use crate::models::requests::create_project_request::CreateProjectRequest;
use crate::models::requests::local_project_base_request::LocalProjectBaseRequest;
use crate::models::requests::search_and_replace_request::SearchAndReplaceRequest;
use crate::models::responses::base_response::BaseResponse;
use anyhow::Result;
use keadex_mina::controller::project_controller::{close_project, create_project, open_project};
use keadex_mina::model::file_search_results::FileSearchResults;
use keadex_mina::model::project::Project;
use keadex_mina::model::project_settings::ProjectSettings;
use keadex_mina::service::search_service::search_and_replace_text;
use keadex_mina::validator::project_validator::validate_project_structure;
use rmcp::Json;

pub async fn open_project_tool(
  _router: &KeadexMinaServer,
  request: LocalProjectBaseRequest,
) -> Result<Json<Project>, String> {
  let project = open_project(&request.mina_project_path)
    .await
    .map_err(|e| e.msg)?;
  Ok(Json(project))
}

pub async fn close_project_tool(
  _router: &KeadexMinaServer,
  request: LocalProjectBaseRequest,
) -> Result<Json<BaseResponse>, String> {
  let success = close_project(&request.mina_project_path)
    .await
    .map_err(|e| e.msg)?;
  Ok(Json(BaseResponse { success }))
}

pub async fn create_project_tool(
  _router: Option<&KeadexMinaServer>,
  request: CreateProjectRequest,
) -> Result<Json<ProjectSettings>, String> {
  let mut project_settings = ProjectSettings {
    root: request.root,
    name: request.name,
    description: request.description,
    version: request.version,
    ..Default::default()
  };
  project_settings.autosave_enabled = false;

  let returned_project_settings = create_project(project_settings).await.map_err(|e| e.msg)?;
  Ok(Json(returned_project_settings))
}

pub async fn validate_project_tool(
  _router: &KeadexMinaServer,
  request: LocalProjectBaseRequest,
) -> Result<(), String> {
  validate_project_structure(&request.mina_project_path)
    .await
    .map_err(|e| e.msg)
}

pub async fn search_and_replace_in_project_tool(
  _router: &KeadexMinaServer,
  request: SearchAndReplaceRequest,
) -> Result<Json<FileSearchResults>, String> {
  search_and_replace_text(
    request.text_to_search,
    request.replacement,
    request.include_diagrams,
    request.include_library,
    false,
    false,
  )
  .await
  .map_err(|e| e.msg)
  .map(Json)
}
