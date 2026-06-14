use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::create_diagram_request::CreateDiagramRequest;
use mina_mcp_server::models::requests::local_diagram_base_request::LocalDiagramBaseRequest;
use mina_mcp_server::tools::local_diagrams_tools::delete_diagram_tool;

pub async fn delete_diagram(request: LocalDiagramBaseRequest) -> Result<(), MinaError> {
  let response = delete_diagram_tool(None, request)
    .await
    .map_err(|e| MinaError::new(0, &e))?;
  let json = serialize_obj_to_json_string(&response.0, false)?;
  println!("{}", json);
  return Ok(());
}
