/*!
Project Validator.
It contains the validators that validate different requirements of a Mina project.
*/

use crate::api::filesystem::FileSystemAPI as FsApiTrait;
use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::FileSystemAPI;
use crate::dao::filesystem::library::{
  component_dao, container_dao, person_dao, software_system_dao,
};
use crate::error_handling::errors::{
  EXISTING_PROJECT_DIRECTORY_ERROR_MSG, INVALID_NEW_PROJECT_PATH_ERROR_CODE,
  INVALID_PROJECT_STRUCTURE_ERROR_CODE, MISSING_MINA_CONFIG_ERROR_CODE,
  MISSING_MINA_CONFIG_ERROR_MSG, NOT_A_DIRECTORY_ERROR_MSG,
  NOT_EXISTING_PARENT_PATH_PROJECT_ERROR_MSG,
};
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::diagrams_path;
use crate::helper::library_helper::project_library_path;
use crate::helper::project_helper::project_settings_path;
use crate::resolve_to_write;
use std::path::{Path, MAIN_SEPARATOR};

/**
Checks if the provided root contains a valid Mina project.
# Arguments
  * `root` - root of the Mina project
*/
pub async fn validate_project_structure(root: &str) -> Result<(), MinaError> {
  contains_mina_config_file(root).await?;
  contains_diagrams_folder(root).await?;
  contains_project_library(root).await?;
  Ok(())
}

async fn contains_mina_config_file(root: &str) -> Result<(), MinaError> {
  let store = ROOT_RESOLVER.get().read().await;

  let full_path = project_settings_path(root);
  if resolve_to_write!(store, FileSystemAPI)
    .await
    .path_exists(&Path::new(root))
    .await?
    && !resolve_to_write!(store, FileSystemAPI)
      .await
      .path_exists(&Path::new(&full_path))
      .await?
  {
    let error = MinaError::new(
      MISSING_MINA_CONFIG_ERROR_CODE,
      MISSING_MINA_CONFIG_ERROR_MSG,
    );
    log::error!("{}", error);
    return Err(error);
  }
  Ok(())
}

async fn contains_diagrams_folder(root: &str) -> Result<(), MinaError> {
  let store = ROOT_RESOLVER.get().read().await;

  let full_path = diagrams_path(root);
  if !resolve_to_write!(store, FileSystemAPI)
    .await
    .path_exists(&Path::new(&full_path))
    .await?
  {
    let error = MinaError::new(
      INVALID_PROJECT_STRUCTURE_ERROR_CODE,
      format!(
        "Invalid project structure. Diagrams folder ({}) does not exist.",
        full_path
      )
      .as_str(),
    );
    log::error!("{}", error);
    return Err(error);
  }
  Ok(())
}

async fn contains_project_library(root: &str) -> Result<(), MinaError> {
  let store = ROOT_RESOLVER.get().read().await;

  let library_folder_path = project_library_path(root);
  // Check root library folder exists
  if !resolve_to_write!(store, FileSystemAPI)
    .await
    .path_exists(&Path::new(&library_folder_path))
    .await?
  {
    let error = MinaError::new(
      INVALID_PROJECT_STRUCTURE_ERROR_CODE,
      format!(
        "Invalid project structure. Library folder ({}) does not exist.",
        library_folder_path
      )
      .as_str(),
    );
    log::error!("{}", error);
    return Err(error);
  }

  // Check library folder contains expected files
  let expected_file_names = [
    component_dao::FILE_NAME,
    container_dao::FILE_NAME,
    person_dao::FILE_NAME,
    software_system_dao::FILE_NAME,
  ];
  for expected_file_name in expected_file_names {
    let expected_file_path = format!(
      "{}{}{}",
      library_folder_path, MAIN_SEPARATOR, expected_file_name
    );
    if !resolve_to_write!(store, FileSystemAPI)
      .await
      .path_exists(&Path::new(&expected_file_path))
      .await?
    {
      let error = MinaError::new(
        INVALID_PROJECT_STRUCTURE_ERROR_CODE,
        format!(
          "Invalid project structure. Library file ({}) does not exist.",
          expected_file_path
        )
        .as_str(),
      );
      log::error!("{}", error);
      return Err(error);
    }
  }
  Ok(())
}

/**
Checks if the provided path satisfies the requirement to contain a new project.
# Arguments
  * `root` - root of the new project
  * `project_folder` - folder of the new project
*/
pub async fn validate_output_project_directory(
  root: &str,
  project_folder: &str,
) -> Result<String, MinaError> {
  let store = ROOT_RESOLVER.get().read().await;

  let full_project_root = format!("{}{}{}", root, MAIN_SEPARATOR, project_folder);

  if !resolve_to_write!(store, FileSystemAPI)
    .await
    .path_exists(&Path::new(root))
    .await?
  {
    return Err(MinaError::new(
      INVALID_NEW_PROJECT_PATH_ERROR_CODE,
      NOT_EXISTING_PARENT_PATH_PROJECT_ERROR_MSG,
    ));
  }

  if resolve_to_write!(store, FileSystemAPI)
    .await
    .path_exists(&Path::new(&full_project_root))
    .await?
  {
    return Err(MinaError::new(
      INVALID_NEW_PROJECT_PATH_ERROR_CODE,
      &format!(
        "{}\"{}\"",
        EXISTING_PROJECT_DIRECTORY_ERROR_MSG, project_folder
      ),
    ));
  }

  let metadata = resolve_to_write!(store, FileSystemAPI)
    .await
    .metadata(&Path::new(root))
    .await?;
  if !metadata.is_dir {
    return Err(MinaError::new(
      INVALID_NEW_PROJECT_PATH_ERROR_CODE,
      NOT_A_DIRECTORY_ERROR_MSG,
    ));
  }

  Ok(full_project_root)
}
