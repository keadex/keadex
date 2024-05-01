use crate::service::hook_service::HOOKS_FILE_NAME;
use std::path::MAIN_SEPARATOR;

/**
Utility which generates the path of the hooks file.
# Arguments
  * `root` - Root of the Mina project
*/
pub fn hooks_path(root: &str) -> String {
  format!("{}{}{}", root, MAIN_SEPARATOR, HOOKS_FILE_NAME)
}
