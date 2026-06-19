use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::local_diagram_base_request::LocalDiagramBaseRequest;
use mina_mcp_server::models::responses::base_response::BaseResponse;
use mina_mcp_server::tools::local_diagrams_tools::validate_diagram_tool;

pub async fn validate_diagram(
  validate_diagram_args: LocalDiagramBaseRequest,
) -> Result<(), MinaError> {
  let result = validate_diagram_tool(None, validate_diagram_args).await;
  let response = BaseResponse {
    success: result.is_ok(),
    msg: result.err().map_or(None, |e| Some(e)),
  };
  let json = serialize_obj_to_json_string(&response, false)?;
  println!("{}", json);
  return Ok(());
}
