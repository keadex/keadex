use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::diagram::DiagramType;
use keadex_mina::service::diagram_service::get_diagram;

pub async fn read_diagram(diagram_name: &str, diagram_type: DiagramType) -> Result<(), MinaError> {
  let diagram = get_diagram(diagram_name, diagram_type).await?;
  let json = serialize_obj_to_json_string(&diagram, false)?;
  println!("{}", json);
  return Ok(());
}
