use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::repository::library::library_repository::list_library_elements as list_library_elements_api;

pub async fn list_library_elements() -> Result<(), MinaError> {
  let elements = list_library_elements_api(None).await?;
  let json = serialize_obj_to_json_string(&elements, false)?;
  println!("{}", json);
  return Ok(());
}
