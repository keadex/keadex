use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::update_person_request::UpdatePersonRequest;
use mina_mcp_server::services::library_service::upsert_person as upsert_person_core;

pub async fn upsert_person(args: UpdatePersonRequest) -> Result<(), MinaError> {
  let response = upsert_person_core(args).await?;
  let json = serialize_obj_to_json_string(&response, false)?;
  println!("{}", json);
  return Ok(());
}
