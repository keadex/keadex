/*!
Person Repository.
Module which exposes functions to access/alter Person data.
Under the hood it uses DAOs.
*/

use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::{
  PersonFsDAO, ProjectLibraryIMDAO, ProjectSettingsIMDAO,
};
use crate::dao::filesystem::library::person_dao::FILE_NAME as PERSONS_FILE_NAME;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::delete_references_from_base_data;
use crate::helper::library_helper::project_library_file_path;
use crate::model::c4_element::person::Person;
use crate::model::diagram::diagram_plantuml::DiagramElementType;
use crate::model::diagram::DiagramType;
use crate::model::project_library::ProjectLibrary;
use crate::resolve_to_write;
use crate::service::diagram_service::check_cross_diagrams_elements_aliases;
use std::path::Path;

/**
Creates a Person library element in memory and in file system.
# Arguments
  * `person` - Person with the updated data.
*/
pub fn create_person(person: Person) -> Result<ProjectLibrary, MinaError> {
  check_cross_diagrams_elements_aliases(
    &vec![DiagramElementType::Person(person.clone())],
    None,
    None,
  )?;

  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  // Append the person in the in memory library
  project_library
    .elements
    .persons
    .insert(project_library.elements.persons.len(), person);

  let returned_saved_library = project_library.clone();
  let saved_library = Some(project_library);

  // Save the updated library in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_library);

  // Save the updated persons' library in file system
  resolve_to_write!(store, PersonFsDAO).save_all(
    &saved_library.unwrap().elements.persons,
    Path::new(&project_library_file_path(
      &project_settings.root,
      PERSONS_FILE_NAME,
    )),
  )?;

  Ok(returned_saved_library)
}

/**
Updates a Person library element in memory and in file system.
# Arguments
  * `person` - Person with the updated data.
*/
pub fn update_person(updated_person: Person) -> Result<ProjectLibrary, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  // Search and replace the person in the in memory library
  if let Some(index) = project_library
    .elements
    .persons
    .iter()
    .position(|person| person.base_data.uuid == updated_person.base_data.uuid)
  {
    project_library.elements.persons.remove(index);
    project_library
      .elements
      .persons
      .insert(index, updated_person);
  }

  let returned_saved_library = project_library.clone();
  let saved_library = Some(project_library);

  // Save the updated library in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_library);

  // Save the updated persons' library in file system
  resolve_to_write!(store, PersonFsDAO).save_all(
    &saved_library.unwrap().elements.persons,
    Path::new(&project_library_file_path(
      &project_settings.root,
      PERSONS_FILE_NAME,
    )),
  )?;

  Ok(returned_saved_library)
}

/**
Deletes a Person element, including all its references, from the library.
# Arguments
  * `uuid_element` - UUID of the Person element to delete
*/
pub fn delete_element_by_uuid(uuid_element: &str) -> Result<(), MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  project_library
    .elements
    .persons
    .retain(|person| person.base_data.uuid != Some(uuid_element.to_string()));

  let saved_settings = Some(project_library);

  // Save updated persons in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_settings);

  // Save updated persons in file system
  resolve_to_write!(store, PersonFsDAO).save_all(
    &saved_settings.unwrap().elements.persons,
    Path::new(&project_library_file_path(
      &project_settings.root,
      PERSONS_FILE_NAME,
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

  for person in &mut project_library.elements.persons {
    delete_references_from_base_data(diagram_human_name, diagram_type, &mut person.base_data)?;
  }
  let saved_settings = Some(project_library);

  // Save updated persons in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_settings);

  // Save updated persons in file system
  resolve_to_write!(store, PersonFsDAO).save_all(
    &saved_settings.unwrap().elements.persons,
    Path::new(&project_library_file_path(
      &project_settings.root,
      PERSONS_FILE_NAME,
    )),
  )?;

  Ok(())
}
