/*!
Helper module which exports functions to serialize/deserialize files.
*/

use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI as FsApiTrait;
use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::FileSystemAPI;
use crate::error_handling::errors::{SERDE_PARSING_ERROR_CODE, SERDE_SERIALIZE_ERROR_CODE};
use crate::error_handling::mina_error::MinaError;
use crate::model::diagram::diagram_plantuml::{DiagramPlantUML, PlantUMLSerializer};
use crate::parser::plantuml::plantuml_parser::{C4PlantUMLParser, Rule};
use crate::resolve_to_write;
use pest::Parser;
use serde::de;
use std::io::Read;
use std::path::Path;

/**
Deserializes a JSON file by giving its path
# Arguments
  * `path` - Path of the file
*/
pub fn serialize_obj_to_json_string<T>(data: &T, pretty: bool) -> Result<String, MinaError>
where
  T: serde::Serialize + std::fmt::Debug,
{
  let result;
  if pretty {
    result = serde_json::to_string_pretty(data);
  } else {
    result = serde_json::to_string(data);
  }
  if let Err(error) = result {
    log::error!("{}", error);
    let error_msg = format!("{:?} {}", data, error.to_string());
    return Err(MinaError::new(
      SERDE_SERIALIZE_ERROR_CODE,
      error_msg.as_str(),
    ));
  }
  return Ok(result.unwrap());
}

/**
Deserializes a JSON file by giving its path
# Arguments
  * `path` - Path of the file
*/
pub async fn deserialize_json_by_path<T>(path: &Path) -> Result<T, MinaError>
where
  T: de::DeserializeOwned,
{
  let store = ROOT_RESOLVER.get().read().await;
  let mut file = resolve_to_write!(store, FileSystemAPI)
    .await
    .open(true, false, false, false, path)
    .await?;
  return deserialize_json_by_file(&mut file, path).await;
}

/**
Deserializes a JSON file
# Arguments
  * `file` - File
*/
pub async fn deserialize_json_by_file<T>(
  file: &mut Box<dyn CrossFile>,
  path: &Path,
) -> Result<T, MinaError>
where
  T: de::DeserializeOwned,
{
  let reader = file.get_buffer().await?;
  let result = serde_json::from_reader(reader);
  if let Err(error) = result {
    log::error!("{}", error);
    let error_msg = format!("{}: {}", path.to_str().unwrap(), error.to_string());
    return Err(MinaError::new(SERDE_PARSING_ERROR_CODE, error_msg.as_str()));
  }
  return Ok(result.unwrap());
}

/**
Deserializes a PlantUML file
# Arguments
  * `file` - File
*/
pub async fn deserialize_plantuml_by_file(
  file: &mut Box<dyn CrossFile>,
) -> Result<DiagramPlantUML, MinaError> {
  let mut reader = file.get_buffer().await?;
  let mut buffer = String::new();
  reader.read_to_string(&mut buffer).unwrap();
  deserialize_plantuml_by_string(&buffer)
}

/**
Deserializes a PlantUML string
# Arguments
  * `raw_plantuml` - Raw PlantUML content
*/
pub fn deserialize_plantuml_by_string(raw_plantuml: &String) -> Result<DiagramPlantUML, MinaError> {
  let c4plantuml_result = C4PlantUMLParser::parse(Rule::plantuml_file, raw_plantuml);
  if let Err(error) = c4plantuml_result {
    log::error!("{}", error);
    return Err(error.into());
  }
  let c4plantuml = c4plantuml_result.unwrap().next().unwrap();

  Ok(c4plantuml.try_into().unwrap())
}

/**
Serializes a diagram into PlantUML
# Arguments
  * `diagram` - Diagram
*/
pub fn serialize_diagram_to_plantuml(diagram: &DiagramPlantUML) -> String {
  diagram.serialize_to_plantuml(0)
}

/**
Generates the indent value starting from a given hierarchy's level.
# Arguments
  * `level` - Level of the hierarchy
*/
pub fn level_to_indent(level: usize) -> usize {
  return level * 2;
}

/**
Formats the given text with an indentation according to the given level.
# Arguments
  * `level` - Level of the hierarchy
  * `text` - Text to format
*/
pub fn format_with_indent(level: usize, text: String) -> String {
  format!("{:indent$}{}", "", text, indent = level_to_indent(level))
}
