use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::local_project_base_request::LocalProjectBaseRequest;
use mina_mcp_server::models::responses::base_response::BaseResponse;
use mina_mcp_server::tools::local_project_tools::validate_project_tool;

pub async fn validate_project(root: &str) -> Result<(), MinaError> {
  let result = validate_project_tool(
    None,
    LocalProjectBaseRequest {
      mina_project_path: root.to_string(),
    },
  )
  .await;
  let response = BaseResponse {
    success: result.is_ok(),
    msg: result.err().map_or(None, |e| Some(e)),
  };
  let json = serialize_obj_to_json_string(&response, false)?;
  println!("{}", json);
  return Ok(());
}
