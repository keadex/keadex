use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::service::search_service::search_diagram_element as search_diagram_element_api;
use std::i32;

pub fn search_diagram_element(alias: &str) -> Result<(), MinaError> {
  let results = search_diagram_element_api(alias, "", true, false, i32::MAX)?;
  let json = serialize_obj_to_json_string(&results, false)?;
  println!("{}", json);
  return Ok(());
}