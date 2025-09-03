use crate::dao::filesystem::project_settings_dao::FILE_NAME;
use crate::helper::diagram_helper::diagram_to_link_string;
use crate::model::diagram::C4ElementType;
use crate::model::diagram::DiagramType;
use convert_case::Case::Lower;
use convert_case::Casing;
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

/**
Utility which generates the key for storing/retrieving the diagram's project's aliases.
# Arguments
  * `diagram_human_name` - Human name of the diagram
  * `diagram_type` - Type of the diagram
*/
pub fn project_aliases_diagram_key(diagram_human_name: &str, diagram_type: &DiagramType) -> String {
  format!(
    "diagrams/{}",
    diagram_to_link_string(diagram_human_name, diagram_type).unwrap()
  )
}

/**
Utility which generates the key for storing/retrieving the library's project's aliases.
# Arguments
  * `c4_element_type` - Type of the library element
*/
pub fn project_aliases_lib_key(lib_element_type: C4ElementType) -> String {
  format!("library/{}s", lib_element_type.to_string().to_case(Lower))
}
