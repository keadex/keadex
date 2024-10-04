use crate::dao::filesystem::project_settings_dao::FILE_NAME;
#[cfg(feature = "desktop")]
use std::path::MAIN_SEPARATOR;

/**
Utility which generates the full project settings path.
# Arguments
  * `root` - Root of the Mina project
*/
#[cfg(feature = "desktop")]
pub fn project_settings_path(root: &str) -> String {
  format!("{}{}{}", root, MAIN_SEPARATOR, FILE_NAME)
}

/**
Utility which generates the full project settings URL.
# Arguments
  * `project_root_url` - URL of the project's root
*/
pub fn project_settings_url(project_root_url: &str) -> String {
  format!("{}/{}", project_root_url, FILE_NAME)
}
