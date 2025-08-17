/*!
Diagram Controller
Exposes to the front-end the commands to manage diagrams.
*/

use crate::core::serializer::deserialize_plantuml_by_string as deserialize_plantuml_by_string_helper;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper;
use crate::helper::diagram_helper::diagram_from_link_string as diagram_from_link_string_helper;
use crate::helper::diagram_helper::diagram_name_type_from_path as diagram_name_type_from_path_helper;
use crate::helper::diagram_helper::diagram_name_type_from_url;
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
use keadex_mina_macro::web_controller;
use std::collections::HashMap;
use wasm_bindgen::prelude::wasm_bindgen;

/**
Returns the list of the diagrams in the opened project.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn list_diagrams() -> Result<HashMap<DiagramType, Vec<String>>, MinaError> {
  Ok(diagram_repository::list_diagrams().await?)
}

/**
Returns the data of a diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn get_diagram(
  diagram_name: String,
  diagram_type: DiagramType,
) -> Result<Diagram, MinaError> {
  return get_diagram_service(&diagram_name, diagram_type).await;
}

/**
Opens and parses a diagram.
Returns the opened and parsed diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn open_diagram(
  diagram_name: String,
  diagram_type: DiagramType,
) -> Result<Diagram, MinaError> {
  Ok(diagram_repository::open_diagram(&diagram_name, diagram_type).await?)
}

/**
Opens a remote diagram.
Returns the opened and parsed diagram.
# Arguments
  * `project_root_url` - URL of the project's root.
  * `diagram_url` - URL of the diagram.
  * `raw_plantuml` - Raw PlantUML of the diagram.
  * `raw_diagram_spec` - Raw (stringified json) specifications of the diagram.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, wasm_bindgen)]
pub async fn open_remote_diagram(
  project_root_url: &str,
  diagram_url: &str,
  raw_plantuml: &str,
  raw_diagram_spec: &str,
) -> Result<Diagram, MinaError> {
  let diagram_plantuml = deserialize_plantuml_by_string_helper(&raw_plantuml.to_string())?;
  let diagram_spec = serde_json::from_str::<DiagramSpec>(raw_diagram_spec)?;
  let (diagram_name, diagram_type) = diagram_name_type_from_url(project_root_url, diagram_url)?;
  // let mut auto_layout = None;
  // if diagram_spec.auto_layout_enabled {
  //   auto_layout = Some(generate_positions(
  //     &diagram_plantuml.elements,
  //     &diagram_spec.auto_layout_orientation,
  //   ));
  // }

  Ok(Diagram {
    diagram_name: Some(diagram_name),
    diagram_type: Some(diagram_type),
    diagram_plantuml: Some(diagram_plantuml),
    diagram_spec: Some(diagram_spec),
    raw_plantuml: Some(String::from(raw_plantuml)),
    last_modified: None,
    auto_layout: None,
    auto_layout_errors: None,
  })
}

/**
Closes a diagram and and unlocks its files.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn close_diagram(
  diagram_name: String,
  diagram_type: DiagramType,
) -> Result<bool, MinaError> {
  Ok(diagram_repository::close_diagram(&diagram_name, diagram_type).await?)
}

/**
Deletes a diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn delete_diagram(
  diagram_name: String,
  diagram_type: DiagramType,
) -> Result<ProjectLibrary, MinaError> {
  Ok(diagram_repository::delete_diagram(&diagram_name, &diagram_type).await?)
}

/**
Creates a diagram.
# Arguments
  * `new_diagram` - New diagram to create.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn create_diagram(new_diagram: Diagram) -> Result<bool, MinaError> {
  diagram_repository::create_diagram(new_diagram).await?;
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
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn save_spec_diagram_raw_plantuml(
  raw_plantuml: String,
  diagram_spec: DiagramSpec,
  diagram_name: String,
  diagram_type: DiagramType,
) -> Result<Diagram, MinaError> {
  log::info!("Saving raw PlantUML & Spec of the diagram {}", diagram_name);
  diagram_repository::save_spec_diagram_raw_plantuml(
    &raw_plantuml,
    &diagram_spec,
    &diagram_name,
    &diagram_type,
  )
  .await?;
  diagram_repository::open_diagram(&diagram_name, diagram_type).await
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
// #[cfg_attr(desktop, tauri::command)]
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
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn export_diagram_to_file(
  diagram_data_url: String,
  format: DiagramFormat,
  diagram_name: String,
  diagram_type: DiagramType,
) -> Result<String, MinaError> {
  log::info!("Exporting diagram {} to {}", diagram_name, format);
  Ok(
    diagram_repository::export_diagram_to_file(
      &diagram_data_url,
      &format,
      &diagram_name,
      &diagram_type,
    )
    .await?,
  )
}

/**
Serialize a parsed PlantUML object, into a PlantUML string.
# Arguments
  * `parsed_element` - Parsed PlantUML object to serialize.
  * `element_level` - Level of the PlantUML object to serialize (since it could be a child of another element). The level will affect the indentation.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
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
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn diagram_to_link_string(
  diagram_human_name: String,
  diagram_type: DiagramType,
) -> Result<String, MinaError> {
  Ok(diagram_to_link_string_helper(
    &diagram_human_name,
    &diagram_type,
  )?)
}

/**
Utility which parse the link string (e.g. container/diagram-name)
to extract the diagram's name and type.
# Arguments
  * `link_string` - Diagram's link
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn diagram_from_link_string(link_string: String) -> Result<Diagram, MinaError> {
  Ok(diagram_from_link_string_helper(&link_string)?)
}

/**
Deserializes a PlantUML string
# Arguments
  * `raw_plantuml` - Raw PlantUML content
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn deserialize_plantuml_by_string(
  raw_plantuml: String,
) -> Result<DiagramPlantUML, MinaError> {
  Ok(deserialize_plantuml_by_string_helper(&raw_plantuml)?)
}

/**
Retrieves diagram's name and type starting from its path.
Example: <PROJECT_ROOT>/diagrams/<DIAGRAM_TYPE>/<DIAGRAM_NAME>/diagram.puml -> (<DIAGRAM_NAME>, <DIAGRAM_TYPE>)
# Arguments
  * `path` - Path to process
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn diagram_name_type_from_path(path: String) -> Result<Diagram, MinaError> {
  let (diagram_name, diagram_type) = diagram_name_type_from_path_helper(&path).await?;
  Ok(Diagram {
    diagram_name: Some(diagram_name),
    diagram_type: Some(diagram_type),
    diagram_spec: None,
    diagram_plantuml: None,
    raw_plantuml: None,
    last_modified: None,
    auto_layout: None,
    auto_layout_errors: None,
  })
}

/**
Retrieves the dependents of an architectural element with the given alias in the given diagram.
# Arguments
  * `alias` - Alias of the architectural element.
  * `diagram_name` - Name of the diagram.
  * `diagram_type` - Type of the diagram.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn dependent_elements_in_diagram(
  alias: String,
  diagram_name: String,
  diagram_type: DiagramType,
) -> Result<Vec<String>, MinaError> {
  return dependent_elements_in_diagram_service(&alias, &diagram_name, diagram_type).await;
}

/**
Returns the PlantUML URL of a diagram.
# Arguments
  * `project_root_url` - URL of the project's root.
  * `diagram_url` - URL of the diagram.
*/
#[cfg_attr(desktop, tauri::command)]
pub async fn diagram_plantuml_url_from_diagram_url(
  project_root_url: &str,
  diagram_url: &str,
) -> Result<String, MinaError> {
  diagram_helper::diagram_plantuml_url_from_diagram_url(project_root_url, diagram_url)
}

/**
Returns the specifications URL of a diagram.
# Arguments
  * `project_root_url` - URL of the project's root.
  * `diagram_url` - URL of the diagram.
*/
#[cfg_attr(desktop, tauri::command)]
pub async fn diagram_spec_url_from_diagram_url(
  project_root_url: &str,
  diagram_url: &str,
) -> Result<String, MinaError> {
  diagram_helper::diagram_spec_url_from_diagram_url(project_root_url, diagram_url)
}

/**
Returns the diagram URL from a link string.
# Arguments
  * `project_root_url` - URL of the project's root.
  * `link_string` - Link string of the diagram.
*/
#[cfg_attr(desktop, tauri::command)]
pub async fn diagram_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  diagram_helper::diagram_url_from_link_string(project_root_url, link_string)
}
