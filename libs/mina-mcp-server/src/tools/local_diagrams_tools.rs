use crate::KeadexMina;
use crate::models::requests::read_local_diagram_request::ReadLocalDiagramRequest;
use anyhow::Result;
use keadex_mina::model::diagram::Diagram;
use keadex_mina::repository::diagram_repository::list_diagrams;
use keadex_mina::service::diagram_service::get_diagram;
use keadex_mina::{error_handling::mina_error::MinaError, model::diagram::DiagramType};
use mina_cli::helpers::mina_lifecycle_helper::{clear_keadex_mina, init_keadex_mina};
use rmcp::handler::server::wrapper::Json;
use std::collections::HashMap;
use std::path::PathBuf;

pub async fn read_diagram_tool(
  _router: &KeadexMina,
  request: ReadLocalDiagramRequest,
) -> Result<Json<Diagram>, Json<MinaError>> {
  init_keadex_mina(&PathBuf::from(&request.mina_project_path))
    .await
    .map_err(|e| Json(e))?;
  let diagram = get_diagram(&request.diagram_name, request.diagram_type)
    .await
    .map_err(|e| Json(e))?;
  clear_keadex_mina(&PathBuf::from(&request.mina_project_path)).await;
  Ok(Json(diagram))
}

pub async fn list_diagrams_tool(
  _router: &KeadexMina,
  request: ReadLocalDiagramRequest,
) -> Result<Json<HashMap<DiagramType, Vec<String>>>, Json<MinaError>> {
  init_keadex_mina(&PathBuf::from(&request.mina_project_path))
    .await
    .map_err(|e| Json(e))?;
  let diagrams = list_diagrams().await.map_err(|e| Json(e))?;
  clear_keadex_mina(&PathBuf::from(&request.mina_project_path)).await;
  Ok(Json(diagrams))
}
