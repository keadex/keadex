/*!
Error codes:
  - < 0 --> Internal errors
  -   0 --> Generic error
  - > 0 --> User errors
*/
pub const INVALID_LIB_ELEMENT_ERROR_CODE: i32 = -8;
pub const WALKDIR_ERROR_CODE: i32 = -7;
pub const OPENAI_ERROR_CODE: i32 = -6;
pub const SERDE_SERIALIZE_ERROR_CODE: i32 = -5;
pub const SERDE_PARSING_ERROR_CODE: i32 = -4;
pub const GENERIC_PARSING_ERROR_CODE: i32 = -3;
pub const STRUM_PARSING_ERROR_CODE: i32 = -2;
pub const IO_ERROR_CODE: i32 = -1;
pub const GENERIC_ERROR_CODE: i32 = 0;
pub const MISSING_MINA_CONFIG_ERROR_CODE: i32 = 1;
pub const INVALID_PLANTUML_ERROR_CODE: i32 = 2;
pub const INVALID_PROJECT_STRUCTURE_ERROR_CODE: i32 = 3;
pub const PROJECT_NOT_LOADED_ERROR_CODE: i32 = 4;
pub const INVALID_NEW_PROJECT_PATH_ERROR_CODE: i32 = 5;
pub const LIBRARY_ERROR_CODE: i32 = 6;
pub const INVALID_NEW_DIAGRAM_PATH_ERROR_CODE: i32 = 7;
pub const DUPLICATED_ALIASES_IN_DIAGRAM_ERROR_CODE: i32 = 8;
pub const DUPLICATED_ALIASES_IN_PROJECT_ERROR_CODE: i32 = 9;

// Error messages
pub const GENERIC_ERROR_MSG: &str = "Generic error.";
pub const MISSING_MINA_CONFIG_ERROR_MSG: &str =
  "Provided path does not contain a valid Mina configuration's file.";
pub const NO_CACHED_FILE_ERROR_MSG: &str = "File not cached. Open the file before working with it.";
pub const PARSING_DIAGRAM_PATH_ERROR_MSG: &str =
  "An error occurs on parsing diagram's path to retrieve name and type.";
pub const CANNOT_OPEN_FILE_ERROR_MSG: &str = "Cannot open the file. Unknown reason.";
pub const FILE_DOES_NOT_EXIST: &str = "File does not exist.";
pub const PROJECT_NOT_LOADED_ERROR_MSG: &str = "Project not loaded.";
pub const NOT_A_DIRECTORY_ERROR_MSG: &str = "Provided path is not a directory.";
pub const EXISTING_PROJECT_DIRECTORY_ERROR_MSG: &str = "The following project directory already exists: ";
pub const NOT_EXISTING_PARENT_PATH_PROJECT_ERROR_MSG: &str = "Provided parent path of the project does not exist.";
pub const INVALID_LIBRARY_PATH_ERROR_MSG: &str = "Invalid library's path.";
pub const EXISTING_DIAGRAM_ERROR_MSG: &str =
  "A diagram with the given name and type already exists. Choose a different name or type.";
pub const INVALID_LIB_ELEMENT_ERROR_MSG: &str = "Provided element is not a valid library element.";
