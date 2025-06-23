use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::repository::library::library_repository::search_library_element as search_library_element_api;

pub async fn search_library_element(alias: &str) -> Result<(), MinaError> {
  let element = search_library_element_api(alias).await?;
  if let Some(found_element) = element {
    let json = serialize_obj_to_json_string(&found_element, false)?;
    println!("{}", json);
    return Ok(());
  }
  return Err(MinaError::new(
    -1,
    &format!("Element with alias \"{}\" not found.", alias),
  ));
}
