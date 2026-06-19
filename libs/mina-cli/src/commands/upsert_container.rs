use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::update_container_request::UpdateContainerRequest;
use mina_mcp_server::services::library_service::upsert_container as upsert_container_core;

pub async fn upsert_container(args: UpdateContainerRequest) -> Result<(), MinaError> {
  let response = upsert_container_core(args).await?;
  let json = serialize_obj_to_json_string(&response, false)?;
  println!("{}", json);
  return Ok(());
}
