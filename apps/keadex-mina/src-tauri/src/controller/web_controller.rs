use crate::core::serializer::deserialize_plantuml_by_string;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::{
  diagram_name_type_from_url,
  diagram_plantuml_url_from_diagram_url as diagram_plantuml_url_from_diagram_url_helper,
  diagram_plantuml_url_from_link_string as diagram_plantuml_url_from_link_string_helper,
  diagram_spec_url_from_diagram_url as diagram_spec_url_from_diagram_url_helper,
  diagram_spec_url_from_link_string as diagram_spec_url_from_link_string_helper,
  diagram_url_from_link_string as diagram_url_from_link_string_helper,
};
use crate::model::diagram::diagram_spec::DiagramSpec;
use crate::model::diagram::Diagram;

pub fn open_diagram(
  project_root_url: &str,
  diagram_url: &str,
  raw_plantuml: &str,
  raw_diagram_spec: &str,
) -> Result<Diagram, MinaError> {
  let diagram_plantuml = deserialize_plantuml_by_string(&raw_plantuml.to_string())?;
  let diagram_spec = serde_json::from_str::<DiagramSpec>(raw_diagram_spec)?;
  let (diagram_name, diagram_type) = diagram_name_type_from_url(project_root_url, diagram_url)?;
  Ok(Diagram {
    diagram_name: Some(diagram_name),
    diagram_type: Some(diagram_type),
    diagram_plantuml: Some(diagram_plantuml),
    diagram_spec: Some(diagram_spec),
    raw_plantuml: Some(String::from(raw_plantuml)),
    last_modified: None,
  })
}

pub fn diagram_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  diagram_url_from_link_string_helper(project_root_url, link_string)
}

pub fn diagram_plantuml_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  diagram_plantuml_url_from_link_string_helper(project_root_url, link_string)
}

pub fn diagram_spec_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  diagram_spec_url_from_link_string_helper(project_root_url, link_string)
}

pub fn diagram_plantuml_url_from_diagram_url(
  project_root_url: &str,
  diagram_url: &str,
) -> Result<String, MinaError> {
  diagram_plantuml_url_from_diagram_url_helper(project_root_url, diagram_url)
}

pub fn diagram_spec_url_from_diagram_url(
  project_root_url: &str,
  diagram_url: &str,
) -> Result<String, MinaError> {
  diagram_spec_url_from_diagram_url_helper(project_root_url, diagram_url)
}
