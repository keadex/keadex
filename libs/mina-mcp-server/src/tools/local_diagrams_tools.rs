use crate::models::requests::read_local_diagram_request::ReadLocalDiagramRequest;
use crate::models::responses::list_local_diagrams_response::ListLocalDiagramsResponse;
use crate::{
  KeadexMinaServer,
  models::responses::read_all_local_diagrams_response::ReadAllLocalDiagramsResponse,
};
use anyhow::Result;
use keadex_mina::model::diagram::Diagram;
use keadex_mina::repository::diagram_repository::list_diagrams;
use keadex_mina::service::diagram_service::get_diagram;
use mina_cli::helpers::mina_lifecycle_helper::{clear_keadex_mina, init_keadex_mina};
use rmcp::Json;
use std::path::PathBuf;

pub async fn read_diagram_tool(
  _router: &KeadexMinaServer,
  request: ReadLocalDiagramRequest,
) -> Result<Json<Diagram>, String> {
  init_keadex_mina(&PathBuf::from(&request.mina_project_path))
    .await
    .map_err(|e| e.msg)?;
  let diagram = get_diagram(&request.diagram_name, request.diagram_type)
    .await
    .map_err(|e| e.msg)?;
  clear_keadex_mina(&PathBuf::from(&request.mina_project_path)).await;
  Ok(Json(diagram))
}

pub async fn list_diagrams_tool(
  _router: &KeadexMinaServer,
  mina_project_path: &str,
) -> Result<Json<ListLocalDiagramsResponse>, String> {
  init_keadex_mina(&PathBuf::from(mina_project_path))
    .await
    .map_err(|e| e.msg)?;
  let diagrams = list_diagrams().await.map_err(|e| e.msg)?;
  clear_keadex_mina(&PathBuf::from(mina_project_path)).await;
  Ok(Json(ListLocalDiagramsResponse { diagrams }))
}

pub async fn read_all_diagrams_tool(
  _router: &KeadexMinaServer,
  mina_project_path: &str,
) -> Result<Json<ReadAllLocalDiagramsResponse>, String> {
  init_keadex_mina(&PathBuf::from(mina_project_path))
    .await
    .map_err(|e| e.msg)?;
  let diagrams = list_diagrams().await.map_err(|e| e.msg)?;
  let mut all_diagrams = Vec::new();
  for (diagram_type, diagram_names) in diagrams {
    for diagram_name in diagram_names {
      let diagram = get_diagram(&diagram_name, diagram_type.clone())
        .await
        .map_err(|e| e.msg)?;
      all_diagrams.push(diagram);
    }
  }
  clear_keadex_mina(&PathBuf::from(mina_project_path)).await;
  Ok(Json(ReadAllLocalDiagramsResponse {
    diagrams: all_diagrams,
  }))
}
