use crate::models::requests::read_local_diagram_request::ReadLocalDiagramRequest;
use crate::models::requests::render_diagram_request::RenderDiagramRequest;
use crate::models::responses::list_local_diagrams_response::ListLocalDiagramsResponse;
use crate::services::keadex_battisti_service::render_diagram;
use crate::{
  KeadexMinaServer,
  models::responses::read_all_local_diagrams_response::ReadAllLocalDiagramsResponse,
};
use anyhow::Result;
use base64::{Engine, engine::general_purpose};
use keadex_mina::model::diagram::Diagram;
use keadex_mina::repository::diagram_repository::list_diagrams;
use keadex_mina::service::diagram_service::get_diagram;
use mina_cli::helpers::mina_lifecycle_helper::{clear_keadex_mina, init_keadex_mina};
use rmcp::Json;
use rmcp::model::{Annotated, Content, RawContent};
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

pub async fn render_diagram_tool(
  _router: &KeadexMinaServer,
  request: ReadLocalDiagramRequest,
) -> Result<Annotated<RawContent>, String> {
  // Read project
  let project = init_keadex_mina(&PathBuf::from(&request.mina_project_path))
    .await
    .map_err(|e| e.msg)?;
  let diagrams_theme_settings = project
    .project_settings
    .themes_settings
    .and_then(|ts| ts.diagrams_theme_settings);

  // Read diagram
  let diagram = get_diagram(&request.diagram_name, request.diagram_type)
    .await
    .map_err(|e| e.msg)?;

  // Invoke Keadex Battisti API to render the diagram
  let png_data = render_diagram(RenderDiagramRequest {
    diagrams_theme_settings,
    diagram,
  })
  .await
  .map_err(|e| e.to_string())?;

  // Close project
  clear_keadex_mina(&PathBuf::from(&request.mina_project_path)).await;

  let encoded_png = general_purpose::STANDARD.encode(png_data);

  Ok(Content::image(encoded_png, "image/png"))
}
