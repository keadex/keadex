use crate::dao::filesystem::project_settings_dao::FILE_NAME;
use std::path::MAIN_SEPARATOR;
use wasm_bindgen::prelude::wasm_bindgen;

/**
Utility which generates the full project settings path.
# Arguments
  * `root` - Root of the Mina project
*/
pub fn project_settings_path(root: &str) -> String {
  format!("{}{}{}", root, MAIN_SEPARATOR, FILE_NAME)
}

/**
Utility which generates the full project settings URL.
# Arguments
  * `project_root_url` - URL of the project's root
*/
#[cfg_attr(web, wasm_bindgen)]
pub fn project_settings_url(project_root_url: &str) -> String {
  format!("{}/{}", project_root_url, FILE_NAME)
}
