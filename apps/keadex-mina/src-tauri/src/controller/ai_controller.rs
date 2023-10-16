use crate::error_handling::mina_error::MinaError;

/**
Uses the AI to generate the PlantUML of a diagram, given its description.
Returns a string containing the PlantUML.
# Arguments
  * `description` - Description of the digram to generate.
*/
#[tauri::command]
pub async fn generate_plantuml(description: &str) -> Result<String, MinaError> {
  let result = crate::service::ai_service::generate_plantuml(description).await?;
  Ok(result)
}
