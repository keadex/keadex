use crate::core::serializer::deserialize_plantuml_by_string;
use crate::error_handling::mina_error::MinaError;
use crate::model::diagram::diagram_plantuml::DiagramPlantUML;

/**
Checks a diagram satisfies all the requirements to be considerated as valid (e.g. syntax) .
Returns the validated diagram.
# Arguments
  * `raw_plantuml` - Raw PlantUML of the diagram.
  * `diagram_spec` - Specifications of the diagram.
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
pub fn validate_diagram(raw_plantuml: &str) -> Result<DiagramPlantUML, MinaError> {
  // deserialize to check the given raw PlantUML has a valid syntax
  let diagram_plantuml = deserialize_plantuml_by_string(&raw_plantuml.to_string())?;

  return Ok(diagram_plantuml);
}

pub fn check_diagram_elements_aliases() -> Result<(), MinaError> {
  Ok(())
}
