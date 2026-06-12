use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use mina_mcp_server::tools::local_diagrams_tools::read_all_diagrams_tool;

pub async fn read_all_diagrams() -> Result<(), MinaError> {
  let diagrams = read_all_diagrams_tool(None)
    .await
    .map_err(|e| MinaError::new(0, &e))?;
  let json = serialize_obj_to_json_string(&diagrams.0, false)?;
  println!("{}", json);
  return Ok(());
}
