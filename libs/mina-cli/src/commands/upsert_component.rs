use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::update_component_request::UpdateComponentRequest;
use mina_mcp_server::services::library_service::upsert_component as upsert_component_core;

pub async fn upsert_component(args: UpdateComponentRequest) -> Result<(), MinaError> {
  let response = upsert_component_core(args).await?;
  let json = serialize_obj_to_json_string(&response, false)?;
  println!("{}", json);
  return Ok(());
}
