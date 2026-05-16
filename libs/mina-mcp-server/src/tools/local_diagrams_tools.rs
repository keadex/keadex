use crate::LocalDiagramBaseRequest;
use crate::models::requests::create_diagram_request::CreateDiagramRequest;
use crate::models::requests::diagram_element_request::DiagramElementRequest;
use crate::models::requests::edit_plantuml_request::EditPlantUmlRequest;
use crate::models::requests::find_diagram_element_request::FindDiagramElementRequest;
use crate::models::requests::render_diagram_request::RenderDiagramRequest;
use crate::models::responses::base_response::BaseResponse;
use crate::models::responses::found_elements_response::FoundElementsResponse;
use crate::models::responses::list_local_diagrams_response::ListLocalDiagramsResponse;
use crate::services::diagram_service::render_diagram;
use crate::{
  KeadexMinaServer,
  models::responses::read_all_local_diagrams_response::ReadAllLocalDiagramsResponse,
};
use anyhow::Result;
use keadex_mina::controller::diagram_controller::{
  create_diagram, delete_diagram, dependent_elements_in_diagram, save_spec_diagram_raw_plantuml,
};
use keadex_mina::model::diagram::Diagram;
use keadex_mina::model::diagram::diagram_spec::DiagramSpec;
use keadex_mina::model::diagram_element_search_results::DiagramElementSearchResults;
use keadex_mina::model::project_library::ProjectLibrary;
use keadex_mina::repository::diagram_repository::list_diagrams;
use keadex_mina::repository::project_repository;
use keadex_mina::service::diagram_service::{get_diagram, validate_diagram};
use keadex_mina::service::search_service::search_diagram_element;
use rmcp::Json;
use rmcp::model::{Annotated, Content, RawContent};

pub async fn read_diagram_tool(
  _router: &KeadexMinaServer,
  request: LocalDiagramBaseRequest,
) -> Result<Json<Diagram>, String> {
  let diagram = get_diagram(&request.diagram_name, request.diagram_type)
    .await
    .map_err(|e| e.msg)?;
  Ok(Json(diagram))
}

pub async fn list_diagrams_tool(
  _router: &KeadexMinaServer,
) -> Result<Json<ListLocalDiagramsResponse>, String> {
  let diagrams = list_diagrams().await.map_err(|e| e.msg)?;
  Ok(Json(ListLocalDiagramsResponse { diagrams }))
}

pub async fn read_all_diagrams_tool(
  _router: &KeadexMinaServer,
) -> Result<Json<ReadAllLocalDiagramsResponse>, String> {
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
  Ok(Json(ReadAllLocalDiagramsResponse {
    diagrams: all_diagrams,
  }))
}

pub async fn render_diagram_tool(
  _router: &KeadexMinaServer,
  request: LocalDiagramBaseRequest,
) -> Result<Annotated<RawContent>, String> {
  let project_settings = project_repository::get_project_settings()
    .await
    .map_err(|e| e.msg)?;
  let diagrams_theme_settings = project_settings
    .themes_settings
    .and_then(|ts| ts.diagrams_theme_settings);

  // Read diagram
  let diagram = get_diagram(&request.diagram_name, request.diagram_type)
    .await
    .map_err(|e| e.msg)?;

  // Invoke Mina nodejs API to render diagram
  let encoded_png = render_diagram(RenderDiagramRequest {
    diagrams_theme_settings,
    diagram,
  })
  .await?;

  Ok(Content::image(encoded_png, "image/png"))
}

pub async fn search_diagram_element_in_project(
  _router: &KeadexMinaServer,
  request: DiagramElementRequest,
) -> Result<Json<DiagramElementSearchResults>, String> {
  search_diagram_element(&request.diagram_element_alias, "", true, false, usize::MAX)
    .await
    .map_err(|e| e.msg)
    .map(Json)
}

pub async fn create_diagram_tool(
  _router: &KeadexMinaServer,
  request: CreateDiagramRequest,
) -> Result<Json<BaseResponse>, String> {
  let mut diagram = Diagram::default();
  diagram.diagram_name = Some(request.diagram_name);
  diagram.diagram_type = Some(request.diagram_type);
  let mut diagram_spec = DiagramSpec::default();
  diagram_spec.description = request.description;
  diagram_spec.tags = request.tags;
  diagram.diagram_spec = Some(diagram_spec);

  create_diagram(diagram)
    .await
    .map_err(|e| e.msg)
    .map(|success| Json(BaseResponse { success }))
}

pub async fn delete_diagram_tool(
  _router: &KeadexMinaServer,
  request: LocalDiagramBaseRequest,
) -> Result<Json<ProjectLibrary>, String> {
  delete_diagram(request.diagram_name, request.diagram_type)
    .await
    .map_err(|e| e.msg)
    .map(Json)
}

pub async fn edit_diagram_plantuml_code_tool(
  _router: &KeadexMinaServer,
  request: EditPlantUmlRequest,
) -> Result<Json<Diagram>, String> {
  // Read the diagram to retrieve its current spec and metadata (e.g., id, name, type)
  let diagram = read_diagram_tool(
    _router,
    LocalDiagramBaseRequest {
      diagram_name: request.diagram_name.clone(),
      diagram_type: request.diagram_type.clone(),
    },
  )
  .await?;

  save_spec_diagram_raw_plantuml(
    request.raw_plantuml,
    diagram.0.diagram_spec.unwrap(),
    request.diagram_name,
    request.diagram_type,
  )
  .await
  .map_err(|e| e.msg)
  .map(Json)
}

pub async fn validate_diagram_tool(
  _router: &KeadexMinaServer,
  request: LocalDiagramBaseRequest,
) -> Result<Json<BaseResponse>, String> {
  let diagram = read_diagram_tool(
    _router,
    LocalDiagramBaseRequest {
      diagram_name: request.diagram_name.clone(),
      diagram_type: request.diagram_type.clone(),
    },
  )
  .await?
  .0;
  validate_diagram(
    &diagram.raw_plantuml.unwrap(),
    &diagram.diagram_name.unwrap(),
    &diagram.diagram_type.unwrap(),
  )
  .await
  .map_err(|e| e.msg)
  .map(|_| Json(BaseResponse { success: true }))
}

pub async fn find_dependent_elements_in_diagram_tool(
  _router: &KeadexMinaServer,
  request: FindDiagramElementRequest,
) -> Result<Json<FoundElementsResponse>, String> {
  dependent_elements_in_diagram(
    request.diagram_element_alias,
    request.diagram_name,
    request.diagram_type,
  )
  .await
  .map_err(|e| e.msg)
  .map(|elements| Json(FoundElementsResponse { aliases: elements }))
}
