use crate::core::serializer::deserialize_plantuml_by_string;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::diagram_name_type_from_url;
use crate::model::diagram::diagram_spec::DiagramSpec;
use crate::model::diagram::Diagram;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn open_web_diagram(
  project_root_url: &str,
  diagram_url: &str,
  raw_plantuml: &str,
  raw_diagram_spec: &str,
) -> Result<Diagram, MinaError> {
  let diagram_plantuml = deserialize_plantuml_by_string(&raw_plantuml.to_string())?;
  let diagram_spec = serde_json::from_str::<DiagramSpec>(raw_diagram_spec)?;
  let (diagram_name, diagram_type) = diagram_name_type_from_url(project_root_url, diagram_url)?;
  // let mut auto_layout = None;
  // if diagram_spec.auto_layout_enabled {
  //   auto_layout = Some(generate_positions(
  //     &diagram_plantuml.elements,
  //     &diagram_spec.auto_layout_orientation,
  //   ));
  // }

  Ok(Diagram {
    diagram_name: Some(diagram_name),
    diagram_type: Some(diagram_type),
    diagram_plantuml: Some(diagram_plantuml),
    diagram_spec: Some(diagram_spec),
    raw_plantuml: Some(String::from(raw_plantuml)),
    last_modified: None,
    auto_layout: None,
  })
}
