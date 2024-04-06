/*!
Library Repository.
Module which exposes functions to access/alter Library data.
Under the hood it uses DAOs.
*/

use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::ProjectLibraryIMDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::model::c4_element::C4Elements;
use crate::model::diagram::diagram_plantuml::DiagramElementType;
use crate::model::diagram::{C4ElementType, DiagramType};
use crate::model::project_library::ProjectLibrary;
use crate::repository::library::{
  component_repository, container_repository, person_repository, software_system_repository,
};
use crate::resolve_to_write;

/**
List the elements of the given type stored in the library.
# Arguments
  * `filter_c4_element_type` - Type of the diagram's element to filter
*/
pub fn list_library_elements(
  filter_c4_element_type: Option<C4ElementType>,
) -> Result<C4Elements, MinaError> {
  log::info!("List {:?} from the library", filter_c4_element_type);

  let store = ROOT_RESOLVER.get().read().unwrap();
  let c4elements = resolve_to_write!(store, ProjectLibraryIMDAO)
    .get()
    .unwrap()
    .elements;

  if let Some(filter) = filter_c4_element_type {
    let mut returned_c4_elements = C4Elements::default();

    match filter {
      C4ElementType::Person => returned_c4_elements.persons = c4elements.persons,
      C4ElementType::SoftwareSystem => {
        returned_c4_elements.software_systems = c4elements.software_systems
      }
      C4ElementType::Container => returned_c4_elements.containers = c4elements.containers,
      C4ElementType::Component => returned_c4_elements.components = c4elements.components,
    };
    Ok(returned_c4_elements)
  } else {
    Ok(c4elements)
  }
}

/**
Deletes a diagram's element, including all its references, from the library.
Returns updated project's library.
# Arguments
  * `uuid_element` - UUID of the diagram's element to delete
  * `element_type` - Type of the diagram's element to delete
*/
pub fn delete_element_by_uuid(
  uuid_element: &str,
  element_type: C4ElementType,
) -> Result<ProjectLibrary, MinaError> {
  log::info!("Delete, from library, element with UUID {}", uuid_element);

  // Delete the element
  match element_type {
    C4ElementType::Person => person_repository::delete_element_by_uuid(uuid_element)?,
    C4ElementType::SoftwareSystem => {
      software_system_repository::delete_element_by_uuid(uuid_element)?
    }
    C4ElementType::Container => container_repository::delete_element_by_uuid(uuid_element)?,
    C4ElementType::Component => component_repository::delete_element_by_uuid(uuid_element)?,
  };

  let store = ROOT_RESOLVER.get().read().unwrap();
  let result = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();
  Ok(result)
}

/**
Deletes from the library all the references to the given diagram.
Returns updated project's library.
# Arguments
  * `diagram_human_name` - Human name of the diagram to delete
  * `diagram_type` - Type of the diagram to delete
*/
pub fn delete_diagram_references(
  diagram_human_name: &str,
  diagram_type: &DiagramType,
) -> Result<ProjectLibrary, MinaError> {
  person_repository::delete_diagram_references(diagram_human_name, diagram_type)?;
  software_system_repository::delete_diagram_references(diagram_human_name, diagram_type)?;
  container_repository::delete_diagram_references(diagram_human_name, diagram_type)?;
  component_repository::delete_diagram_references(diagram_human_name, diagram_type)?;

  let store = ROOT_RESOLVER.get().read().unwrap();
  let result = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();
  Ok(result)
}

/**
Searches for the given alias in the library.
Returns the found element, if any.
# Arguments
  * `alias` - Alias of the element to search for
*/
pub fn search_library_element(alias: &str) -> Result<Option<DiagramElementType>, MinaError> {
  let library_elements = list_library_elements(None)?;

  let found_person = library_elements
    .persons
    .iter()
    .find(|&person| person.clone().base_data.alias.unwrap() == alias);
  if let Some(person) = found_person {
    return Ok(Some(DiagramElementType::Person(person.clone())));
  }

  let found_software_system = library_elements
    .software_systems
    .iter()
    .find(|&software_system| software_system.clone().base_data.alias.unwrap() == alias);
  if let Some(software_system) = found_software_system {
    return Ok(Some(DiagramElementType::SoftwareSystem(
      software_system.clone(),
    )));
  }

  let found_container = library_elements
    .containers
    .iter()
    .find(|&container| container.clone().base_data.alias.unwrap() == alias);
  if let Some(container) = found_container {
    return Ok(Some(DiagramElementType::Container(container.clone())));
  }

  let found_component = library_elements
    .components
    .iter()
    .find(|&component| component.clone().base_data.alias.unwrap() == alias);
  if let Some(component) = found_component {
    return Ok(Some(DiagramElementType::Component(component.clone())));
  }

  Ok(None)
}
