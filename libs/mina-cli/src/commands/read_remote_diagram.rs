use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::read_remote_diagram_request::ReadRemoteDiagramRequest;
use mina_mcp_server::models::responses::base_response::BaseResponse;
use mina_mcp_server::tools::remote_diagrams_tools::read_diagram_tool;

pub async fn read_diagram(request: ReadRemoteDiagramRequest) -> Result<(), MinaError> {
  let diagram_data = read_diagram_tool(None, request)
    .await
    .map_err(|e| MinaError::new(0, &e))?;

  let json;
  if diagram_data.is_none() {
    let error_message = "Diagram not found. Please verify the URLs provided, or, if linking to a private repository, ensure the GitHub token is configured.";
    let response = BaseResponse {
      success: false,
      msg: Some(error_message.to_string()),
    };
    json = serialize_obj_to_json_string(&response, false)?;
  } else {
    json = serialize_obj_to_json_string(&diagram_data.unwrap(), false)?;
  }
  println!("{}", json);
  return Ok(());
}
