use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::validate_plantuml_code_request::ValidatePlantUmlCodeRequest;
use mina_mcp_server::models::responses::base_response::BaseResponse;
use mina_mcp_server::tools::plantuml_code_tools::validate_diagram_plantuml_code_tool;

pub async fn validate_plantuml_code(
  plantuml_code_request: ValidatePlantUmlCodeRequest,
) -> Result<(), MinaError> {
  let result = validate_diagram_plantuml_code_tool(None, plantuml_code_request).await;
  let response = BaseResponse {
    success: result.is_ok(),
    msg: result.err().map_or(None, |e| Some(e)),
  };
  let json = serialize_obj_to_json_string(&response, false)?;
  println!("{}", json);
  return Ok(());
}
