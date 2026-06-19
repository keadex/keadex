use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::create_project_request::CreateProjectRequest;
use mina_mcp_server::tools::local_project_tools::create_project_tool;

pub async fn create_project(request: CreateProjectRequest) -> Result<(), MinaError> {
  let settings = create_project_tool(None, request)
    .await
    .map_err(|e| MinaError::new(0, &e))?;
  let json = serialize_obj_to_json_string(&settings.0, false)?;
  println!("{}", json);
  return Ok(());
}
