/*!
AI Service.
Module which exposes functions to access AI capabilities.
*/
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::errors::{
  AI_ERROR_CODE, INVALID_GENERATED_DIAGRAM, MISSING_AI_SETTINGS_ERROR_MSG,
};
use crate::model::ai::ai_diagram_gen_response::{AIDiagramGenElementType, AIDiagramGenResponse};
use crate::model::ai::ai_settings::AISettings;
use crate::model::c4_element::component::{Component, ComponentType};
use crate::model::c4_element::container::{Container, ContainerType};
use crate::model::c4_element::person::{Person, PersonType};
use crate::model::c4_element::relationship::{Relationship, RelationshipType};
use crate::model::c4_element::software_system::{SoftwareSystem, SystemType};
use crate::model::diagram::diagram_plantuml::{serialize_elements_to_plantuml, DiagramElementType};
use crate::{core::app::ROOT_RESOLVER, error_handling::mina_error::MinaError, resolve_to_write};
use async_openai_wasm::config::OpenAIConfig;
use async_openai_wasm::types::{
  ChatCompletionRequestMessage, ChatCompletionRequestSystemMessage,
  ChatCompletionRequestSystemMessageContent, CreateChatCompletionRequestArgs,
};
use async_openai_wasm::types::{
  ChatCompletionRequestUserMessage, ChatCompletionRequestUserMessageContent,
};
use async_openai_wasm::Client;
use fancy_regex::Regex;

/**
Return the AI Settings
*/
async fn get_ai_settings() -> Option<AISettings> {
  let store = ROOT_RESOLVER.get().read().await;
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .get()
    .await
    .unwrap();
  return project_settings.ai_settings;
}

/**
Uses the AI to generate the PlantUML of a diagram, given its description.
Returns a string containing the PlantUML.
# Arguments
  * `description` - Description of the digram to generate.
*/
pub async fn generate_plantuml(description: &str) -> Result<String, MinaError> {
  if let Some(ai_settings) = get_ai_settings().await {
    if ai_settings.api_base_url.is_some()
      && ai_settings.api_key.is_some()
      && ai_settings.model.is_some()
    {
      let config = OpenAIConfig::new()
        .with_api_base(ai_settings.api_base_url.unwrap())
        .with_api_key(ai_settings.api_key.unwrap());
      let client = Client::with_config(config);

      let request = CreateChatCompletionRequestArgs::default()
        .model(ai_settings.model.unwrap())
        .max_tokens(2048_u16)
        .stream(false)
        .messages([ChatCompletionRequestMessage::System(ChatCompletionRequestSystemMessage {
          content: ChatCompletionRequestSystemMessageContent::Text(String::from("You are a helpful assistant.")),
          name: None,
        }), ChatCompletionRequestMessage::User(ChatCompletionRequestUserMessage {
          content: ChatCompletionRequestUserMessageContent::Text(format!("Generate a C4 Model diagram for the following architecture: \"{}\". To represent the diagram, generate a JSON which satisfies the following JSON schema: {{\"$schema\":\"https://json-schema.org/draft/2020-12/schema\",\"type\":\"object\",\"properties\":{{\"diagram_elements\":{{\"type\":\"array\",\"items\":[{{\"type\":\"object\",\"properties\":{{\"alias\":{{\"type\":\"string\"}},\"label\":{{\"type\":\"string\"}},\"description\":{{\"type\":\"string\"}},\"technology\":{{\"type\":\"string\"}},\"element_type\":{{\"enum\":[\"Person\",\"SoftwareSystem\",\"Container\",\"Component\",\"Relationship\"]}},\"from_alias\":{{\"type\":\"string\"}},\"to_alias\":{{\"type\":\"string\"}}}},\"required\":[\"alias\",\"name\",\"technology\", \"type\"]}}]}}}},\"required\":[\"diagram_elements\"]}}, where: \"alias\" is a snake case string, unique identifier for the diagram element; \"label\" is the name of the diagram element or the verb in case of relationships; \"description\" and \"technology\" represent the description and technology of the diagram element; \"element_type\" is the C4 Model type or it's set to \"relationship\" if the diagram element represents a relationship; \"from_alais\" and \"to_alias\" are present only for relationships and contain the IDs of the starting and ending diagram elements involved in the relationship. Please respond with only the JSON, without explanations and without wrapping the JSON in a markdown code block. Ensure to wrap JSON property names and values in double quotes.", description)),
          name: None,
        })])
        .build()
        .unwrap();

      let choices = client
        .chat() // Get the API "group" (completions, images, etc.) from the client
        .create(request) // Make the API call in that "group"
        .await?
        .choices;

      let mut generated_json = "".to_string();
      if choices.len() > 0 {
        let re_clear = Regex::new(r"(`|\n|\r|\t|json)").unwrap();
        let re_quotes = Regex::new(r#"(`\")"#).unwrap();
        generated_json = re_clear
          .replace_all(&choices[0].clone().message.content.unwrap(), "")
          .to_string();
        generated_json = re_quotes.replace_all(&generated_json, "\"").to_string();
        if let Some(start_index) = generated_json.find("{") {
          // Slice the string starting from the found index
          generated_json = generated_json[start_index..].to_string();
        }
      }

      // log::debug!("{}", generated_json);

      let generated_diagram_result = serde_json::from_str::<AIDiagramGenResponse>(&generated_json);
      if let Ok(generated_diagram) = generated_diagram_result {
        let mut elements = vec![];
        for element in generated_diagram.diagram_elements {
          if let Some(element_type) = element.element_type {
            match element_type {
              AIDiagramGenElementType::Person => {
                let mut person = Person::default();
                person.base_data.alias = element.alias;
                person.base_data.label = element.label;
                person.base_data.description = element.description;
                person.person_type = Some(PersonType::Person);
                elements.push(DiagramElementType::Person(person));
              }
              AIDiagramGenElementType::SoftwareSystem => {
                let mut software_system = SoftwareSystem::default();
                software_system.base_data.alias = element.alias;
                software_system.base_data.label = element.label;
                software_system.base_data.description = element.description;
                software_system.system_type = Some(SystemType::System);
                elements.push(DiagramElementType::SoftwareSystem(software_system));
              }
              AIDiagramGenElementType::Container => {
                let mut container = Container::default();
                container.base_data.alias = element.alias;
                container.base_data.label = element.label;
                container.base_data.description = element.description;
                container.technology = element.technology;
                container.container_type = Some(ContainerType::Container);
                elements.push(DiagramElementType::Container(container));
              }
              AIDiagramGenElementType::Component => {
                let mut component = Component::default();
                component.base_data.alias = element.alias;
                component.base_data.label = element.label;
                component.base_data.description = element.description;
                component.technology = element.technology;
                component.component_type = Some(ComponentType::Component);
                elements.push(DiagramElementType::Component(component));
              }
              AIDiagramGenElementType::Relationship => {
                let mut relationship = Relationship::default();
                relationship.base_data.alias = element.alias;
                relationship.base_data.label = element.label;
                relationship.base_data.description = element.description;
                relationship.from = element.from_alias;
                relationship.to = element.to_alias;
                relationship.technology = element.technology;
                relationship.relationship_type = Some(RelationshipType::Rel);
                elements.push(DiagramElementType::Relationship(relationship));
              }
            }
          } else {
            return Err(MinaError::new(AI_ERROR_CODE, INVALID_GENERATED_DIAGRAM));
          }
        }

        let generated_plantuml = serialize_elements_to_plantuml(&elements, 0);
        return Ok(generated_plantuml);
      } else {
        return Err(MinaError::new(AI_ERROR_CODE, INVALID_GENERATED_DIAGRAM));
      }
    }
  }
  return Err(MinaError::new(AI_ERROR_CODE, MISSING_AI_SETTINGS_ERROR_MSG));
}
