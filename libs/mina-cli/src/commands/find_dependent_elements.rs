use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::diagram::DiagramType;
use keadex_mina::service::diagram_service::dependent_elements_in_diagram;

pub async fn find_dependent_elements(
  alias: &str,
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<(), MinaError> {
  let dependents = dependent_elements_in_diagram(alias, diagram_name, diagram_type).await?;
  let json = serialize_obj_to_json_string(&dependents, false)?;
  println!("{}", json);
  return Ok(());
}
