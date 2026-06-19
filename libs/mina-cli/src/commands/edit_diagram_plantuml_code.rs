use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::models::requests::edit_plantuml_request::EditPlantUmlRequest;
use mina_mcp_server::tools::local_diagrams_tools::edit_diagram_plantuml_code_tool;

pub async fn edit_diagram_plantuml_code(request: EditPlantUmlRequest) -> Result<(), MinaError> {
  let response = edit_diagram_plantuml_code_tool(None, request)
    .await
    .map_err(|e| MinaError::new(0, &e))?;
  let json = serialize_obj_to_json_string(&response.0, false)?;
  println!("{}", json);
  return Ok(());
}
