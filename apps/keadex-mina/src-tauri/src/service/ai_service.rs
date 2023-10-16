/*!
AI Service.
Module which exposes functions to access AI capabilities.
*/
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::{core::app::ROOT_RESOLVER, error_handling::mina_error::MinaError, resolve_to_write};
use async_openai::{types::CreateCompletionRequestArgs, Client};

/**
Return the OpenAI API Key
*/
fn get_openai_api_key() -> String {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  project_settings.openai_api_key.unwrap()
}

/**
Uses the AI to generate the PlantUML of a diagram, given its description.
Returns a string containing the PlantUML.
# Arguments
  * `description` - Description of the digram to generate.
*/
pub async fn generate_plantuml(description: &str) -> Result<String, MinaError> {
  let client = Client::new().with_api_key(get_openai_api_key());

  let full_description = "Show me the PlantUML code by using the C4-PlantUML stdlib and by omitting directives, of a C4 Model diagram with the following description: ".to_owned() + description;

  let request = CreateCompletionRequestArgs::default()
    .model("text-davinci-003")
    .prompt(full_description)
    .max_tokens(2048_u16)
    .build()
    .unwrap();

  let response = client
    .completions() // Get the API "group" (completions, images, etc.) from the client
    .create(request) // Make the API call in that "group"
    .await?;

  let full_response = response
    .choices
    .iter()
    .map(|s| s.text.to_string())
    .reduce(|cur: String, nxt: String| cur + &nxt)
    .unwrap();

  Ok(full_response)
}
