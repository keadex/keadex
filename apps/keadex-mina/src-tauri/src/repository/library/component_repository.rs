/*!
Component Repository.
Module which exposes functions to access/alter Component data.
Under the hood it uses DAOs.
*/

use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::{
  ComponentFsDAO, ProjectLibraryIMDAO, ProjectSettingsIMDAO,
};
use crate::dao::filesystem::library::component_dao::FILE_NAME as COMPONENTS_FILE_NAME;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::delete_references_from_base_data;
use crate::helper::library_helper::project_library_file_path;
use crate::model::c4_element::component::Component;
use crate::model::diagram::DiagramType;
use crate::model::project_library::ProjectLibrary;
use crate::resolve_to_write;
use std::path::Path;

/**
Creates a Component library element in memory and in file system.
# Arguments
  * `component` - Component with the updated data.
*/
pub async fn create_component(component: Component) -> Result<ProjectLibrary, MinaError> {
  let store = ROOT_RESOLVER.get().read().await;
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .get()
    .await
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .get()
    .await
    .unwrap();

  // Append the component in the in memory library
  project_library
    .elements
    .components
    .insert(project_library.elements.components.len(), component);

  let returned_saved_library = project_library.clone();
  let saved_library = Some(project_library);

  // Save the updated library in memory
  resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .save(&saved_library)
    .await;

  // Save the updated components' library in file system
  resolve_to_write!(store, ComponentFsDAO)
    .await
    .save_all(
      &saved_library.unwrap().elements.components,
      Path::new(&project_library_file_path(
        &project_settings.root,
        COMPONENTS_FILE_NAME,
      )),
    )
    .await?;

  Ok(returned_saved_library)
}

/**
Updates a Component library element in memory and in file system.
# Arguments
  * `component` - Component with the updated data.
*/
pub async fn update_component(updated_component: Component) -> Result<ProjectLibrary, MinaError> {
  let store = ROOT_RESOLVER.get().read().await;
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .get()
    .await
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .get()
    .await
    .unwrap();

  // Search and replace the component in the in memory library
  if let Some(index) = project_library
    .elements
    .components
    .iter()
    .position(|component| component.base_data.uuid == updated_component.base_data.uuid)
  {
    project_library.elements.components.remove(index);
    project_library
      .elements
      .components
      .insert(index, updated_component);
  }

  let returned_saved_library = project_library.clone();
  let saved_library = Some(project_library);

  // Save the updated library in memory
  resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .save(&saved_library)
    .await;

  // Save the updated components' library in file system
  resolve_to_write!(store, ComponentFsDAO)
    .await
    .save_all(
      &saved_library.unwrap().elements.components,
      Path::new(&project_library_file_path(
        &project_settings.root,
        COMPONENTS_FILE_NAME,
      )),
    )
    .await?;

  Ok(returned_saved_library)
}

/**
Deletes a Component element, including all its references, from the library.
# Arguments
  * `uuid_element` - UUID of the Component element to delete
*/
pub async fn delete_element_by_uuid(uuid_element: &str) -> Result<(), MinaError> {
  let store = ROOT_RESOLVER.get().read().await;
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .get()
    .await
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .get()
    .await
    .unwrap();

  project_library
    .elements
    .components
    .retain(|component| component.base_data.uuid != Some(uuid_element.to_string()));

  let saved_settings = Some(project_library);

  // Save updated components in memory
  resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .save(&saved_settings)
    .await;

  // Save updated components in file system
  resolve_to_write!(store, ComponentFsDAO)
    .await
    .save_all(
      &saved_settings.unwrap().elements.components,
      Path::new(&project_library_file_path(
        &project_settings.root,
        COMPONENTS_FILE_NAME,
      )),
    )
    .await?;

  Ok(())
}

/**
Deletes from the library all the references to the given diagram.
# Arguments
  * `diagram_human_name` - Human name of the diagram to delete
  * `diagram_type` - Type of the diagram to delete
*/
pub async fn delete_diagram_references(
  diagram_human_name: &str,
  diagram_type: &DiagramType,
) -> Result<(), MinaError> {
  let store = ROOT_RESOLVER.get().read().await;
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .get()
    .await
    .unwrap();
  let mut project_library = resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .get()
    .await
    .unwrap();

  for component in &mut project_library.elements.components {
    delete_references_from_base_data(diagram_human_name, diagram_type, &mut component.base_data)?;
  }
  let saved_settings = Some(project_library);

  // Save updated components in memory
  resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .save(&saved_settings)
    .await;

  // Save updated components in file system
  resolve_to_write!(store, ComponentFsDAO)
    .await
    .save_all(
      &saved_settings.unwrap().elements.components,
      Path::new(&project_library_file_path(
        &project_settings.root,
        COMPONENTS_FILE_NAME,
      )),
    )
    .await?;

  Ok(())
}
