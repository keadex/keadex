use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::dao::filesystem::library::component_dao::FILE_NAME as COMPONENT_FILE_NAME;
use crate::dao::filesystem::library::container_dao::FILE_NAME as CONTAINER_FILE_NAME;
use crate::dao::filesystem::library::person_dao::FILE_NAME as PERSON_FILE_NAME;
use crate::dao::filesystem::library::software_system_dao::FILE_NAME as SOFTWARE_SYSTEM_FILE_NAME;
use crate::dao::filesystem::library::LIBRARY_FOLDER;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::errors::{
  INVALID_LIBRARY_PATH_ERROR_MSG, LIBRARY_ERROR_CODE, PROJECT_NOT_LOADED_ERROR_CODE,
  PROJECT_NOT_LOADED_ERROR_MSG,
};
use crate::error_handling::mina_error::MinaError;
use crate::model::diagram::diagram_plantuml::DiagramElementType;
use crate::model::diagram::diagram_plantuml::DiagramElementType::{
  Boundary, Component, Container, DeploymentNode, Person, Relationship, SoftwareSystem,
};
use crate::model::diagram::C4ElementType;
use crate::resolve_to_write;
use std::path::MAIN_SEPARATOR;

/**
Utility which deletes all the references of the given UUID, from an array of diagram's elements.
# Arguments
  * `referenced_uuid` - UUID of the diagram's element to delete
  * `sub_elements` - Diagram's elements from which remove the references
*/
pub fn delete_references_from_sub_elements(
  referenced_uuid: &str,
  sub_elements: &mut Vec<DiagramElementType>,
) {
  // Removed sub-elements (if referenced)
  sub_elements.retain(|sub_element| match sub_element {
    Person(element) => element.base_data.uuid != Some(referenced_uuid.to_string()),
    SoftwareSystem(element) => element.base_data.uuid != Some(referenced_uuid.to_string()),
    Container(element) => element.base_data.uuid != Some(referenced_uuid.to_string()),
    Component(element) => element.base_data.uuid != Some(referenced_uuid.to_string()),
    Boundary(element) => element.base_data.uuid != Some(referenced_uuid.to_string()),
    DeploymentNode(element) => element.base_data.uuid != Some(referenced_uuid.to_string()),
    Relationship(element) => {
      element.from != Some(referenced_uuid.to_string())
        && element.to != Some(referenced_uuid.to_string())
    }
    _ => true,
  });
}

/**
Utility which generates the full project library path.
# Arguments
  * `root` - Root of the Mina project
*/
pub fn project_library_path(root: &str) -> String {
  format!("{}{}{}", root, MAIN_SEPARATOR, LIBRARY_FOLDER)
}

/**
Utility which generates the full path of a library's file.
# Arguments
  * `root` - Root of the Mina project
*/
pub fn project_library_file_path(root: &str, file_name: &str) -> String {
  format!(
    "{}{}{}",
    project_library_path(root),
    MAIN_SEPARATOR,
    file_name
  )
}

/**
Utility which retrieves the C4 element type given the full path of a library's file.
# Arguments
  * `path` - Path of a library's file
*/
pub fn element_type_from_path(path: &str) -> Result<C4ElementType, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO).get();
  if let None = project_settings {
    return Err(MinaError::new(
      PROJECT_NOT_LOADED_ERROR_CODE,
      PROJECT_NOT_LOADED_ERROR_MSG,
    ));
  }
  let project_root = project_settings.unwrap().root;
  let person_file_path = project_library_file_path(&project_root, PERSON_FILE_NAME);
  let software_system_file_path =
    project_library_file_path(&project_root, SOFTWARE_SYSTEM_FILE_NAME);
  let container_file_path = project_library_file_path(&project_root, CONTAINER_FILE_NAME);
  let component_file_path = project_library_file_path(&project_root, COMPONENT_FILE_NAME);

  if path.eq(&person_file_path) {
    return Ok(C4ElementType::Person);
  } else if path.eq(&software_system_file_path) {
    return Ok(C4ElementType::SoftwareSystem);
  } else if path.eq(&container_file_path) {
    return Ok(C4ElementType::Container);
  } else if path.eq(&component_file_path) {
    return Ok(C4ElementType::Component);
  } else {
    return Err(MinaError::new(
      LIBRARY_ERROR_CODE,
      INVALID_LIBRARY_PATH_ERROR_MSG,
    ));
  }
}
