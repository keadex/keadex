use crate::DiagramElementRequest;
use crate::FoundElementResponse;
use crate::KeadexMinaServer;
use crate::models::responses::base_response::BaseResponse;
use keadex_mina::model::c4_element::C4Elements;
use keadex_mina::repository::library::library_repository::list_library_elements;
use keadex_mina::repository::library::library_repository::search_library_element;
use mina_cli::commands::upsert_component::upsert_component_core;
use mina_cli::commands::upsert_container::upsert_container_core;
use mina_cli::commands::upsert_person::upsert_person_core;
use mina_cli::commands::upsert_system::upsert_system_core;
use mina_cli::model::commands::update_component::UpdateComponent;
use mina_cli::model::commands::update_container::UpdateContainer;
use mina_cli::model::commands::update_person::UpdatePerson;
use mina_cli::model::commands::update_system::UpdateSystem;
use rmcp::Json;

pub async fn list_library_elements_tool(
  _router: &KeadexMinaServer,
) -> Result<Json<C4Elements>, String> {
  list_library_elements(None)
    .await
    .map_err(|e| e.msg)
    .map(Json)
}

pub async fn search_diagram_element_in_library_tool(
  _router: &KeadexMinaServer,
  request: DiagramElementRequest,
) -> Result<Json<FoundElementResponse>, String> {
  search_library_element(&request.diagram_element_alias)
    .await
    .map_err(|e| e.msg)
    .map(|element| Json(FoundElementResponse { element }))
}

pub async fn upsert_person_in_library_tool(
  _router: &KeadexMinaServer,
  request: UpdatePerson,
) -> Result<Json<BaseResponse>, String> {
  upsert_person_core(request)
    .await
    .map_err(|e| e.msg)
    .map(|_| Json(BaseResponse { success: true }))
}

pub async fn upsert_system_in_library_tool(
  _router: &KeadexMinaServer,
  request: UpdateSystem,
) -> Result<Json<BaseResponse>, String> {
  upsert_system_core(request)
    .await
    .map_err(|e| e.msg)
    .map(|_| Json(BaseResponse { success: true }))
}

pub async fn upsert_container_in_library_tool(
  _router: &KeadexMinaServer,
  request: UpdateContainer,
) -> Result<Json<BaseResponse>, String> {
  upsert_container_core(request)
    .await
    .map_err(|e| e.msg)
    .map(|_| Json(BaseResponse { success: true }))
}

pub async fn upsert_component_in_library_tool(
  _router: &KeadexMinaServer,
  request: UpdateComponent,
) -> Result<Json<BaseResponse>, String> {
  upsert_component_core(request)
    .await
    .map_err(|e| e.msg)
    .map(|_| Json(BaseResponse { success: true }))
}
