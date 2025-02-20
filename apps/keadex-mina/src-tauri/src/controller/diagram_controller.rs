/*!
Diagram Controller
Exposes to the front-end the commands to manage diagrams.
*/

use crate::core::serializer::deserialize_plantuml_by_string as deserialize_plantuml_by_string_helper;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::diagram_from_link_string as diagram_from_link_string_helper;
use crate::helper::diagram_helper::diagram_name_type_from_path as diagram_name_type_from_path_helper;
use crate::helper::diagram_helper::diagram_to_link_string as diagram_to_link_string_helper;
use crate::model::diagram::diagram_plantuml::{
  serialize_elements_to_plantuml, DiagramElementType, DiagramPlantUML,
};
use crate::model::diagram::diagram_spec::DiagramSpec;
use crate::model::diagram::{Diagram, DiagramFormat, DiagramType};
use crate::model::project_library::ProjectLibrary;
use crate::repository::diagram_repository;
use crate::service::diagram_service::dependent_elements_in_diagram as dependent_elements_in_diagram_service;
use crate::service::diagram_service::get_diagram as get_diagram_service;
use std::collections::HashMap;

/**
Returns the list of the diagrams in the opened project.
*/
#[tauri::command]
pub async fn list_diagrams() -> Result<HashMap<DiagramType, Vec<String>>, MinaError> {
  Ok(diagram_repository::list_diagrams()?)
}

/**
Returns the data of a diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
#[tauri::command]
pub async fn get_diagram(
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<Diagram, MinaError> {
  return get_diagram_service(diagram_name, diagram_type);
}

/**
Opens and parses a diagram.
Returns the opened and parsed diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
#[tauri::command]
pub async fn open_diagram(
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<Diagram, MinaError> {
  Ok(diagram_repository::open_diagram(
    diagram_name,
    diagram_type,
  )?)
}

/**
Closes a diagram and and unlocks its files.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
#[tauri::command]
pub async fn close_diagram(
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<bool, MinaError> {
  Ok(diagram_repository::close_diagram(
    diagram_name,
    diagram_type,
  )?)
}

/**
Deletes a diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
#[tauri::command]
pub async fn delete_diagram(
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<ProjectLibrary, MinaError> {
  Ok(diagram_repository::delete_diagram(
    diagram_name,
    &diagram_type,
  )?)
}

/**
Creates a diagram.
# Arguments
  * `new_diagram` - New diagram to create.
*/
#[tauri::command]
pub async fn create_diagram(new_diagram: Diagram) -> Result<bool, MinaError> {
  diagram_repository::create_diagram(new_diagram)?;
  Ok(true)
}

/**
Saves a diagram from its raw PlantUML and cleans the specs (e.g. removes zombies elements).
It also checks the syntax of the raw PlantUML.
Returns the saved diagram.
# Arguments
  * `raw_plantuml` - Raw PlantUML of the diagram.
  * `diagram_spec` - Specifications of the diagram.
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
#[tauri::command]
pub async fn save_spec_diagram_raw_plantuml(
  raw_plantuml: &str,
  diagram_spec: DiagramSpec,
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<Diagram, MinaError> {
  log::info!("Saving raw PlantUML & Spec of the diagram {}", diagram_name);
  diagram_repository::save_spec_diagram_raw_plantuml(
    raw_plantuml,
    &diagram_spec,
    diagram_name,
    &diagram_type,
  )?;
  open_diagram(diagram_name, diagram_type).await
}

/**
Saves a diagram from its parsed representation and cleans the specs (e.g. removes zombies elements).
It also checks the given object is a valid parsed PlantUML representation.
Returns the saved diagram.
# Arguments
  * `diagram_plantuml` - Parsed PlantUML representation of the diagram.
  * `diagram_spec` - Specifications of the diagram.
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
// #[tauri::command]
// pub async fn save_spec_diagram_parsed_plantuml(
//   diagram_plantuml: DiagramPlantUML,
//   diagram_spec: DiagramSpec,
//   diagram_name: &str,
//   diagram_type: DiagramType,
// ) -> Result<Diagram, MinaError> {
//   log::info!("Saving parsed PlantUML of the diagram {}", diagram_name);
//   diagram_repository::save_spec_diagram_parsed_plantuml(
//     &diagram_plantuml,
//     &diagram_spec,
//     diagram_name,
//     &diagram_type,
//   )?;
//   open_diagram(diagram_name, diagram_type).await
// }

/**
Exports a diagram whose content is represented by the given data url,
to a file in the given format.
# Arguments
  * `diagram_data_url` - Data URL of the diagram to export.
  * `format` - Format of the diagram to export.
  * `diagram_name` - Name of the diagram to export.
  * `diagram_type` - Type of the diagram to export.
*/
#[tauri::command]
pub async fn export_diagram_to_file(
  diagram_data_url: &str,
  format: DiagramFormat,
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<String, MinaError> {
  log::info!("Exporting diagram {} to {}", diagram_name, format);
  Ok(diagram_repository::export_diagram_to_file(
    diagram_data_url,
    &format,
    diagram_name,
    &diagram_type,
  )?)
}

/**
Serialize a parsed PlantUML object, into a PlantUML string.
# Arguments
  * `parsed_element` - Parsed PlantUML object to serialize.
  * `element_level` - Level of the PlantUML object to serialize (since it could be a child of another element). The level will affect the indentation.
*/
#[tauri::command]
pub async fn parsed_element_to_plantuml(
  parsed_element: DiagramElementType,
  element_level: usize,
) -> Result<String, MinaError> {
  log::info!("Serialize {}", parsed_element);
  Ok(serialize_elements_to_plantuml(
    &vec![parsed_element],
    element_level,
  ))
}

/**
Generates a link from a diagram.
Example: container/diagram-name
# Arguments
  * `diagram_human_name` - Human name of the diagram
  * `diagram_type` - Type of the diagram
*/
#[tauri::command]
pub async fn diagram_to_link_string(
  diagram_human_name: &str,
  diagram_type: DiagramType,
) -> Result<String, MinaError> {
  Ok(diagram_to_link_string_helper(
    diagram_human_name,
    &diagram_type,
  )?)
}

/**
Utility which parse the link string (e.g. container/diagram-name)
to extract the diagram's name and type.
# Arguments
  * `link_string` - Diagram's link
*/
#[tauri::command]
pub async fn diagram_from_link_string(link_string: &str) -> Result<Diagram, MinaError> {
  Ok(diagram_from_link_string_helper(link_string)?)
}

/**
Deserializes a PlantUML string
# Arguments
  * `raw_plantuml` - Raw PlantUML content
*/
#[tauri::command]
pub async fn deserialize_plantuml_by_string(
  raw_plantuml: &str,
) -> Result<DiagramPlantUML, MinaError> {
  Ok(deserialize_plantuml_by_string_helper(
    &raw_plantuml.to_string(),
  )?)
}

/**
Retrieves diagram's name and type starting from its path.
Example: <PROJECT_ROOT>/diagrams/<DIAGRAM_TYPE>/<DIAGRAM_NAME>/diagram.puml -> (<DIAGRAM_NAME>, <DIAGRAM_TYPE>)
# Arguments
  * `path` - Path to process
*/
#[tauri::command]
pub async fn diagram_name_type_from_path(path: &str) -> Result<Diagram, MinaError> {
  let (diagram_name, diagram_type) = diagram_name_type_from_path_helper(path)?;
  Ok(Diagram {
    diagram_name: Some(diagram_name),
    diagram_type: Some(diagram_type),
    diagram_spec: None,
    diagram_plantuml: None,
    raw_plantuml: None,
    last_modified: None,
    auto_layout: None,
  })
}

/**
Retrieves the dependents of an architectural element with the given alias in the given diagram.
# Arguments
  * `alias` - Alias of the architectural element.
  * `diagram_name` - Name of the diagram.
  * `diagram_type` - Type of the diagram.
*/
#[tauri::command]
pub async fn dependent_elements_in_diagram(
  alias: &str,
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<Vec<String>, MinaError> {
  return dependent_elements_in_diagram_service(alias, diagram_name, diagram_type);
}
