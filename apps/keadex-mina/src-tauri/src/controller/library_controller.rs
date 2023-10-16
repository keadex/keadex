use crate::error_handling::mina_error::MinaError;
use crate::helper::library_helper::element_type_from_path as element_type_from_path_helper;
use crate::model::c4_element::component::Component;
use crate::model::c4_element::container::Container;
use crate::model::c4_element::person::Person;
use crate::model::c4_element::software_system::SoftwareSystem;
use crate::model::c4_element::C4Elements;
use crate::model::diagram::C4ElementType;
use crate::model::project_library::ProjectLibrary;
use crate::repository::library::{
  component_repository, container_repository, library_repository, person_repository,
  software_system_repository,
};

/**
List the elements of the given type stored in the library.
# Arguments
  * `filter_c4_element_type` - Type of the diagram's element to filter
*/
#[tauri::command]
pub async fn list_library_elements(
  filter_c4_element_type: C4ElementType,
) -> Result<C4Elements, MinaError> {
  log::info!("List {} from the library", filter_c4_element_type);
  Ok(library_repository::list_library_elements(
    filter_c4_element_type,
  )?)
}

/**
Deletes a diagram's element, including all its references, from the library.
Returns updated project's library.
# Arguments
  * `uuid_element` - UUID of the diagram's element to delete
  * `element_type` - Type of the diagram's element to delete
*/
#[tauri::command]
pub async fn delete_library_element(
  uuid_element: &str,
  element_type: C4ElementType,
) -> Result<ProjectLibrary, MinaError> {
  log::info!(
    "Delete, from library, element with UUID {} and type {}",
    uuid_element,
    element_type
  );
  Ok(library_repository::delete_element_by_uuid(
    uuid_element,
    element_type,
  )?)
}

/**
Saves in the library (in memory and in file system) the given new Person.
# Arguments
  * `person` - Person with the updated data.
*/
#[tauri::command]
pub async fn create_person(person: Person) -> Result<ProjectLibrary, MinaError> {
  let cloned_uuid = (&person).base_data.uuid.clone();
  log::info!(
    "Create in the library the person with UUID {}",
    cloned_uuid.unwrap()
  );
  Ok(person_repository::create_person(person)?)
}

/**
Updates the library (in memory and in file system) with the given updated Person.
# Arguments
  * `person` - Person with the updated data.
*/
#[tauri::command]
pub async fn update_person(person: Person) -> Result<ProjectLibrary, MinaError> {
  let cloned_uuid = (&person).base_data.uuid.clone();
  log::info!(
    "Update the person with UUID {} in the library",
    cloned_uuid.unwrap()
  );
  Ok(person_repository::update_person(person)?)
}

/**
Saves in the library (in memory and in file system) the given new Software System.
# Arguments
  * `software_system` - Person with the updated data.
*/
#[tauri::command]
pub async fn create_software_system(
  software_system: SoftwareSystem,
) -> Result<ProjectLibrary, MinaError> {
  let cloned_uuid = (&software_system).base_data.uuid.clone();
  log::info!(
    "Create in the library the software system with UUID {}",
    cloned_uuid.unwrap()
  );
  Ok(software_system_repository::create_software_system(
    software_system,
  )?)
}

/**
Updates the library (in memory and in file system) with the given updated Software System.
# Arguments
  * `software_system` - Software System with the updated data.
*/
#[tauri::command]
pub async fn update_software_system(
  software_system: SoftwareSystem,
) -> Result<ProjectLibrary, MinaError> {
  let cloned_uuid = (&software_system).base_data.uuid.clone();
  log::info!(
    "Update the software system with UUID {} in the library",
    cloned_uuid.unwrap()
  );
  Ok(software_system_repository::update_software_system(
    software_system,
  )?)
}

/**
Saves in the library (in memory and in file system) the given new Container.
# Arguments
  * `container` - Container with the updated data.
*/
#[tauri::command]
pub async fn create_container(container: Container) -> Result<ProjectLibrary, MinaError> {
  let cloned_uuid = (&container).base_data.uuid.clone();
  log::info!(
    "Create in the library the container with UUID {}",
    cloned_uuid.unwrap()
  );
  Ok(container_repository::create_container(container)?)
}

/**
Updates the library (in memory and in file system) with the given updated Container.
# Arguments
  * `container` - Container with the updated data.
*/
#[tauri::command]
pub async fn update_container(container: Container) -> Result<ProjectLibrary, MinaError> {
  let cloned_uuid = (&container).base_data.uuid.clone();
  log::info!(
    "Update the container with UUID {} in the library",
    cloned_uuid.unwrap()
  );
  Ok(container_repository::update_container(container)?)
}

/**
Saves in the library (in memory and in file system) the given new Component.
# Arguments
  * `component` - Component with the updated data.
*/
#[tauri::command]
pub async fn create_component(component: Component) -> Result<ProjectLibrary, MinaError> {
  let cloned_uuid = (&component).base_data.uuid.clone();
  log::info!(
    "Create in the library the component with UUID {}",
    cloned_uuid.unwrap()
  );
  Ok(component_repository::create_component(component)?)
}

/**
Updates the library (in memory and in file system) with the given updated Component.
# Arguments
  * `component` - Component with the updated data.
*/
#[tauri::command]
pub async fn update_component(component: Component) -> Result<ProjectLibrary, MinaError> {
  let cloned_uuid = (&component).base_data.uuid.clone();
  log::info!(
    "Update the component with UUID {} in the library",
    cloned_uuid.unwrap()
  );
  Ok(component_repository::update_component(component)?)
}

/**
Retrieves the C4 element type given the full path of a library's file.
# Arguments
  * `path` - Path of a library's file
*/
#[tauri::command]
pub async fn library_element_type_from_path(path: &str) -> Result<C4ElementType, MinaError> {
  element_type_from_path_helper(path)
}
