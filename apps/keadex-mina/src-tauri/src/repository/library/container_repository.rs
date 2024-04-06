/*!
Container Repository.
Module which exposes functions to access/alter Container data.
Under the hood it uses DAOs.
*/

use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::{
  ContainerFsDAO, ProjectLibraryIMDAO, ProjectSettingsIMDAO,
};
use crate::dao::filesystem::library::container_dao::FILE_NAME as CONTAINERS_FILE_NAME;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::delete_references_from_base_data;
use crate::helper::library_helper::project_library_file_path;
use crate::model::c4_element::container::Container;
use crate::model::diagram::diagram_plantuml::DiagramElementType;
use crate::model::diagram::DiagramType;
use crate::model::project_library::ProjectLibrary;
use crate::resolve_to_write;
use crate::service::diagram_service::check_cross_diagrams_elements_aliases;
use std::path::Path;

/**
Creates a Container library element in memory and in file system.
# Arguments
  * `container` - Container with the updated data.
*/
pub fn create_container(container: Container) -> Result<ProjectLibrary, MinaError> {
  check_cross_diagrams_elements_aliases(
    &vec![DiagramElementType::Container(container.clone())],
    None,
    None,
  )?;

  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  // Append the container in the in memory library
  project_library
    .elements
    .containers
    .insert(project_library.elements.containers.len(), container);

  let returned_saved_library = project_library.clone();
  let saved_library = Some(project_library);

  // Save the updated library in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_library);

  // Save the updated containers' library in file system
  resolve_to_write!(store, ContainerFsDAO).save_all(
    &saved_library.unwrap().elements.containers,
    Path::new(&project_library_file_path(
      &project_settings.root,
      CONTAINERS_FILE_NAME,
    )),
  )?;

  Ok(returned_saved_library)
}

/**
Updates a Container library element in memory and in file system.
# Arguments
  * `container` - Container with the updated data.
*/
pub fn update_container(updated_container: Container) -> Result<ProjectLibrary, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  // Search and replace the container in the in memory library
  if let Some(index) = project_library
    .elements
    .containers
    .iter()
    .position(|container| container.base_data.uuid == updated_container.base_data.uuid)
  {
    project_library.elements.containers.remove(index);
    project_library
      .elements
      .containers
      .insert(index, updated_container);
  }

  let returned_saved_library = project_library.clone();
  let saved_library = Some(project_library);

  // Save the updated library in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_library);

  // Save the updated containers' library in file system
  resolve_to_write!(store, ContainerFsDAO).save_all(
    &saved_library.unwrap().elements.containers,
    Path::new(&project_library_file_path(
      &project_settings.root,
      CONTAINERS_FILE_NAME,
    )),
  )?;

  Ok(returned_saved_library)
}

/**
Deletes a Container element, including all its references, from the library.
# Arguments
  * `uuid_element` - UUID of the Container element to delete
*/
pub fn delete_element_by_uuid(uuid_element: &str) -> Result<(), MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  project_library
    .elements
    .containers
    .retain(|container| container.base_data.uuid != Some(uuid_element.to_string()));

  let saved_settings = Some(project_library);

  // Save updated containers in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_settings);

  // Save updated containers in file system
  resolve_to_write!(store, ContainerFsDAO).save_all(
    &saved_settings.unwrap().elements.containers,
    Path::new(&project_library_file_path(
      &project_settings.root,
      CONTAINERS_FILE_NAME,
    )),
  )?;

  Ok(())
}

/**
Deletes from the library all the references to the given diagram.
# Arguments
  * `diagram_human_name` - Human name of the diagram to delete
  * `diagram_type` - Type of the diagram to delete
*/
pub fn delete_diagram_references(
  diagram_human_name: &str,
  diagram_type: &DiagramType,
) -> Result<(), MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  for container in &mut project_library.elements.containers {
    delete_references_from_base_data(diagram_human_name, diagram_type, &mut container.base_data)?;
  }
  let saved_settings = Some(project_library);

  // Save updated containers in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_settings);

  // Save updated containers in file system
  resolve_to_write!(store, ContainerFsDAO).save_all(
    &saved_settings.unwrap().elements.containers,
    Path::new(&project_library_file_path(
      &project_settings.root,
      CONTAINERS_FILE_NAME,
    )),
  )?;

  Ok(())
}
