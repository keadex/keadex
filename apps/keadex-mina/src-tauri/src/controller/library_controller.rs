use crate::error_handling::mina_error::MinaError;
use crate::helper::library_helper::element_type_from_path as element_type_from_path_helper;
use crate::model::c4_element::C4Elements;
use crate::model::diagram::diagram_plantuml::DiagramElementType;
use crate::model::diagram::C4ElementType;
use crate::model::project_library::ProjectLibrary;
use crate::repository::library::library_repository;
use keadex_mina_macro::web_controller;

/**
List the elements of the given type stored in the library.
# Arguments
  * `filter_c4_element_type` - Type of the diagram's element to filter
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn list_library_elements(
  filter_c4_element_type: C4ElementType,
) -> Result<C4Elements, MinaError> {
  log::info!("List {} from the library", filter_c4_element_type);
  Ok(library_repository::list_library_elements(Some(filter_c4_element_type)).await?)
}

/**
Saves in the library (in memory and in file system) the given new diagram's element.
Returns the updated library.
# Arguments
  * `diagram_element` - Diagram's element to create
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn create_library_element(
  diagram_element: DiagramElementType,
) -> Result<ProjectLibrary, MinaError> {
  log::info!("Create element in library");
  library_repository::create_element(&diagram_element).await
}

/**
Updates the library (in memory and in file system) with the given updated diagram's element.
Returns the updated library.
# Arguments
  * `diagram_element` - Diagram's element to update
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn update_library_element(
  old_diagram_element: DiagramElementType,
  new_diagram_element: DiagramElementType,
) -> Result<ProjectLibrary, MinaError> {
  log::info!(
    "Update element in library from {} to {}",
    old_diagram_element,
    new_diagram_element
  );
  library_repository::update_element(&old_diagram_element, &new_diagram_element).await
}

/**
Deletes a diagram's element, including all its references, from the library.
Returns updated project's library.
# Arguments
  * `uuid_element` - UUID of the diagram's element to delete
  * `element_type` - Type of the diagram's element to delete
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn delete_library_element(
  uuid_element: String,
  element_type: C4ElementType,
) -> Result<ProjectLibrary, MinaError> {
  log::info!(
    "Delete, from library, element with UUID {} and type {}",
    uuid_element,
    element_type
  );
  Ok(library_repository::delete_element_by_uuid(&uuid_element, element_type).await?)
}

/**
Retrieves the C4 element type given the full path of a library's file.
# Arguments
  * `path` - Path of a library's file
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn library_element_type_from_path(path: String) -> Result<C4ElementType, MinaError> {
  element_type_from_path_helper(&path).await
}
