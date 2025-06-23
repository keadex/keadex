use crate::error_handling::mina_error::MinaError;
use keadex_mina_macro::web_controller;

/**
Uses the AI to generate the PlantUML of a diagram, given its description.
Returns a string containing the PlantUML.
# Arguments
  * `description` - Description of the digram to generate.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn generate_plantuml(description: String) -> Result<String, MinaError> {
  let result = crate::service::ai_service::generate_plantuml(&description).await?;
  Ok(result)
}
