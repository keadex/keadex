use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::repository::diagram_repository::list_diagrams as list_diagrams_api;

pub fn list_diagrams() -> Result<(), MinaError> {
  let diagrams = list_diagrams_api()?;
  let json = serialize_obj_to_json_string(&diagrams, false)?;
  println!("{}", json);
  return Ok(());
}
