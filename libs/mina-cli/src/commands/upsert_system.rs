use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::update_system_request::UpdateSystemRequest;
use mina_mcp_server::services::library_service::upsert_system as upsert_system_core;

pub async fn upsert_system(args: UpdateSystemRequest) -> Result<(), MinaError> {
  let response = upsert_system_core(args).await?;
  let json = serialize_obj_to_json_string(&response, false)?;
  println!("{}", json);
  return Ok(());
}
