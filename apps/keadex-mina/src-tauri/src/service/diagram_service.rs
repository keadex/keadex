use std::collections::HashSet;

use crate::core::serializer::deserialize_plantuml_by_string;
use crate::error_handling::errors::DUPLICATED_ALIASES_IN_DIAGRAM;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::get_all_elements_aliases;
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
  // check that there are no duplicated aliases in the given diagram
  check_diagram_elements_aliases(&diagram_plantuml)?;
  return Ok(diagram_plantuml);
}

/**
Checks a diagram does not contain duplicated aliases.
Returns an error if the diagram contains duplicated aliases.
# Arguments
  * `diagram_plantuml` - Parsed representation of the diagram.
*/
pub fn check_diagram_elements_aliases(diagram_plantuml: &DiagramPlantUML) -> Result<(), MinaError> {
  let aliases = get_all_elements_aliases(&diagram_plantuml.elements);
  let mut map_aliases: HashSet<String> = HashSet::new();
  for alias in aliases {
    let added = map_aliases.insert(alias.clone());
    if !added {
      return Err(MinaError::new(
        DUPLICATED_ALIASES_IN_DIAGRAM,
        &format!(
          "The alias \"{}\" is already present in the diagram. Please choose a different alias.",
          alias
        ),
      ));
    }
  }
  Ok(())
}
