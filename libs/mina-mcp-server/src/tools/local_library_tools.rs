use crate::core::server::KeadexMinaServer;
use crate::models::requests::diagram_element_request::DiagramElementRequest;
use crate::models::requests::update_component_request::UpdateComponentRequest;
use crate::models::requests::update_container_request::UpdateContainerRequest;
use crate::models::requests::update_person_request::UpdatePersonRequest;
use crate::models::requests::update_system_request::UpdateSystemRequest;
use crate::models::responses::base_response::BaseResponse;
use crate::models::responses::found_element_response::FoundElementResponse;
use crate::services::library_service::{
  upsert_component, upsert_container, upsert_person, upsert_system,
};
use keadex_mina::model::c4_element::C4Elements;
use keadex_mina::repository::library::library_repository::list_library_elements;
use keadex_mina::repository::library::library_repository::search_library_element;
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
  request: UpdatePersonRequest,
) -> Result<Json<BaseResponse>, String> {
  upsert_person(request).await.map_err(|e| e.msg).map(|_| {
    Json(BaseResponse {
      success: true,
      msg: None,
    })
  })
}

pub async fn upsert_system_in_library_tool(
  _router: &KeadexMinaServer,
  request: UpdateSystemRequest,
) -> Result<Json<BaseResponse>, String> {
  upsert_system(request).await.map_err(|e| e.msg).map(|_| {
    Json(BaseResponse {
      success: true,
      msg: None,
    })
  })
}

pub async fn upsert_container_in_library_tool(
  _router: &KeadexMinaServer,
  request: UpdateContainerRequest,
) -> Result<Json<BaseResponse>, String> {
  upsert_container(request).await.map_err(|e| e.msg).map(|_| {
    Json(BaseResponse {
      success: true,
      msg: None,
    })
  })
}

pub async fn upsert_component_in_library_tool(
  _router: &KeadexMinaServer,
  request: UpdateComponentRequest,
) -> Result<Json<BaseResponse>, String> {
  upsert_component(request).await.map_err(|e| e.msg).map(|_| {
    Json(BaseResponse {
      success: true,
      msg: None,
    })
  })
}
