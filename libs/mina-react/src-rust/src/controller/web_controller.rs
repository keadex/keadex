use keadex_mina::controller::web_controller::{
  diagram_plantuml_url_from_diagram_url as diagram_plantuml_url_from_diagram_url_core,
  diagram_plantuml_url_from_link_string as diagram_plantuml_url_from_link_string_core,
  diagram_spec_url_from_diagram_url as diagram_spec_url_from_diagram_url_core,
  diagram_spec_url_from_link_string as diagram_spec_url_from_link_string_core,
  diagram_url_from_link_string as diagram_url_from_link_string_core,
  open_diagram as open_diagram_core,
};
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::diagram::Diagram;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn open_diagram(
  project_root_url: &str,
  diagram_url: &str,
  raw_plantuml: &str,
  raw_diagram_spec: &str,
) -> Result<Diagram, MinaError> {
  open_diagram_core(
    project_root_url,
    diagram_url,
    raw_plantuml,
    raw_diagram_spec,
  )
}

#[wasm_bindgen]
pub fn diagram_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  diagram_url_from_link_string_core(project_root_url, link_string)
}

#[wasm_bindgen]
pub fn diagram_plantuml_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  diagram_plantuml_url_from_link_string_core(project_root_url, link_string)
}

#[wasm_bindgen]
pub fn diagram_spec_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  diagram_spec_url_from_link_string_core(project_root_url, link_string)
}

#[wasm_bindgen]
pub fn diagram_plantuml_url_from_diagram_url(
  project_root_url: &str,
  diagram_url: &str,
) -> Result<String, MinaError> {
  diagram_plantuml_url_from_diagram_url_core(project_root_url, diagram_url)
}

#[wasm_bindgen]
pub fn diagram_spec_url_from_diagram_url(
  project_root_url: &str,
  diagram_url: &str,
) -> Result<String, MinaError> {
  diagram_spec_url_from_diagram_url_core(project_root_url, diagram_url)
}
