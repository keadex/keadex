/*!
Project Validator.
It contains the validators that validate different requirements of a Mina project.
*/

use crate::dao::filesystem::library::{
  component_dao, container_dao, person_dao, software_system_dao,
};
use crate::error_handling::errors::{
  DIRECTORY_NOT_EMPTY_ERROR_MSG, INVALID_NEW_PROJECT_PATH_ERROR_CODE,
  INVALID_PROJECT_STRUCTURE_ERROR_CODE, MISSING_MINA_CONFIG_ERROR_CODE,
  MISSING_MINA_CONFIG_ERROR_MSG, NOT_A_DIRECTORY_ERROR_MSG, NOT_EXISTING_PATH_ERROR_MSG,
};
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::diagrams_path;
use crate::helper::library_helper::project_library_path;
use crate::helper::project_helper::project_settings_path;
use std::fs::metadata;
use std::path::{Path, MAIN_SEPARATOR};
use walkdir::WalkDir;

/**
Checks if the provided root contains a valid Mina project.
# Arguments
  * `root` - root of the Mina project
*/
pub fn validate_project_structure(root: &str) -> Result<(), MinaError> {
  contains_mina_config_file(root)?;
  contains_diagrams_folder(root)?;
  contains_project_library(root)?;
  Ok(())
}

fn contains_mina_config_file(root: &str) -> Result<(), MinaError> {
  let full_path = project_settings_path(root);
  if Path::new(&root).exists() && !Path::new(&full_path).exists() {
    let error = MinaError::new(
      MISSING_MINA_CONFIG_ERROR_CODE,
      MISSING_MINA_CONFIG_ERROR_MSG,
    );
    log::error!("{}", error);
    return Err(error);
  }
  Ok(())
}

fn contains_diagrams_folder(root: &str) -> Result<(), MinaError> {
  let full_path = diagrams_path(root);
  if !Path::new(&full_path).exists() {
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

fn contains_project_library(root: &str) -> Result<(), MinaError> {
  let library_folder_path = project_library_path(root);
  // Check root library folder exists
  if !Path::new(&library_folder_path).exists() {
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
    if !Path::new(&expected_file_path).exists() {
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
*/
pub fn validate_output_project_directory(root: &str) -> Result<(), MinaError> {
  if !Path::new(root).exists() {
    return Err(MinaError::new(
      INVALID_NEW_PROJECT_PATH_ERROR_CODE,
      NOT_EXISTING_PATH_ERROR_MSG,
    ));
  }

  if !metadata(root).unwrap().is_dir() {
    return Err(MinaError::new(
      INVALID_NEW_PROJECT_PATH_ERROR_CODE,
      NOT_A_DIRECTORY_ERROR_MSG,
    ));
  }

  // > 1 because the iterator contains at least the root itself
  if WalkDir::new(root).into_iter().count() > 1 {
    return Err(MinaError::new(
      INVALID_NEW_PROJECT_PATH_ERROR_CODE,
      DIRECTORY_NOT_EMPTY_ERROR_MSG,
    ));
  }
  Ok(())
}
