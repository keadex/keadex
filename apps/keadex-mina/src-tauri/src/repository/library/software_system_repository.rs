/*!
Software System Repository.
Module which exposes functions to access/alter Software System data.
Under the hood it uses DAOs.
*/

use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::{
  ProjectLibraryIMDAO, ProjectSettingsIMDAO, SoftwareSystemFsDAO,
};
use crate::dao::filesystem::library::software_system_dao::FILE_NAME as SOFTWARE_SYSTEMS_FILE_NAME;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::delete_references_from_base_data;
use crate::helper::library_helper::project_library_file_path;
use crate::model::c4_element::software_system::SoftwareSystem;
use crate::model::diagram::DiagramType;
use crate::model::project_library::ProjectLibrary;
use crate::resolve_to_write;
use std::path::Path;

/**
Creates a Software System library element in memory and in file system.
# Arguments
  * `software_system` - Software System with the updated data.
*/
pub fn create_software_system(
  software_system: SoftwareSystem,
) -> Result<ProjectLibrary, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  // Append the software_system in the in memory library
  project_library.elements.software_systems.insert(
    project_library.elements.software_systems.len(),
    software_system,
  );

  let returned_saved_library = project_library.clone();
  let saved_library = Some(project_library);

  // Save the updated library in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_library);

  // Save the updated software_systems' library in file system
  resolve_to_write!(store, SoftwareSystemFsDAO).save_all(
    &saved_library.unwrap().elements.software_systems,
    Path::new(&project_library_file_path(
      &project_settings.root,
      SOFTWARE_SYSTEMS_FILE_NAME,
    )),
  )?;

  Ok(returned_saved_library)
}

/**
Updates a Software System library element in memory and in file system.
# Arguments
  * `software_system` - Software System with the updated data.
*/
pub fn update_software_system(
  updated_software_system: SoftwareSystem,
) -> Result<ProjectLibrary, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  // Search and replace the software system in the in memory library
  if let Some(index) =
    project_library
      .elements
      .software_systems
      .iter()
      .position(|software_system| {
        software_system.base_data.uuid == updated_software_system.base_data.uuid
      })
  {
    project_library.elements.software_systems.remove(index);
    project_library
      .elements
      .software_systems
      .insert(index, updated_software_system);
  }

  let returned_saved_library = project_library.clone();
  let saved_library = Some(project_library);

  // Save the updated library in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_library);

  // Save the updated software systems' library in file system
  resolve_to_write!(store, SoftwareSystemFsDAO).save_all(
    &saved_library.unwrap().elements.software_systems,
    Path::new(&project_library_file_path(
      &project_settings.root,
      SOFTWARE_SYSTEMS_FILE_NAME,
    )),
  )?;

  Ok(returned_saved_library)
}

/**
Deletes a Software System element, including all its references, from the library.
# Arguments
  * `uuid_element` - UUID of the Software System element to delete
*/
pub fn delete_element_by_uuid(uuid_element: &str) -> Result<(), MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO).get().unwrap();

  project_library
    .elements
    .software_systems
    .retain(|software_system| software_system.base_data.uuid != Some(uuid_element.to_string()));

  let saved_settings = Some(project_library);

  // Save updated software systems in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_settings);

  // Save updated software systems in file system
  resolve_to_write!(store, SoftwareSystemFsDAO).save_all(
    &saved_settings.unwrap().elements.software_systems,
    Path::new(&project_library_file_path(
      &project_settings.root,
      SOFTWARE_SYSTEMS_FILE_NAME,
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

  for software_system in &mut project_library.elements.software_systems {
    delete_references_from_base_data(
      diagram_human_name,
      diagram_type,
      &mut software_system.base_data,
    )?;
  }
  let saved_settings = Some(project_library);

  // Save updated software systems in memory
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&saved_settings);

  // Save updated software systems in file system
  resolve_to_write!(store, SoftwareSystemFsDAO).save_all(
    &saved_settings.unwrap().elements.software_systems,
    Path::new(&project_library_file_path(
      &project_settings.root,
      SOFTWARE_SYSTEMS_FILE_NAME,
    )),
  )?;

  Ok(())
}
