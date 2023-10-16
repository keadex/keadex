use crate::dao::filesystem::project_settings_dao::FILE_NAME;
use std::path::MAIN_SEPARATOR;

/**
Utility which generates the full project settings path.
# Arguments
  * `root` - Root of the Mina project
*/
pub fn project_settings_path(root: &str) -> String {
  format!("{}{}{}", root, MAIN_SEPARATOR, FILE_NAME)
}
