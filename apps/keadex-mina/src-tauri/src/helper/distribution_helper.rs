use std::path::MAIN_SEPARATOR;

/**
Utility which generates the full path of the distribution folder.
# Arguments
  * `root` - Root of the Mina project
*/
pub fn dist_path(root: &str) -> String {
  format!("{}{}{}", root, MAIN_SEPARATOR, "dist")
}
