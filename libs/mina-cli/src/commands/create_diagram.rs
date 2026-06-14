use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::create_diagram_request::CreateDiagramRequest;
use mina_mcp_server::tools::local_diagrams_tools::create_diagram_tool;

pub async fn create_diagram(request: CreateDiagramRequest) -> Result<(), MinaError> {
  let response = create_diagram_tool(None, request)
    .await
    .map_err(|e| MinaError::new(0, &e))?;
  let json = serialize_obj_to_json_string(&response.0, false)?;
  println!("{}", json);
  return Ok(());
}
