use std::collections::HashSet;

use crate::core::serializer::deserialize_plantuml_by_string;
use crate::error_handling::errors::{
  DUPLICATED_ALIASES_IN_DIAGRAM_ERROR_CODE, DUPLICATED_ALIASES_IN_PROJECT_ERROR_CODE,
};
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::{
  diagram_name_type_from_path, diagram_to_link_string, get_all_elements_aliases,
};
use crate::helper::library_helper::element_type_from_path;
use crate::model::c4_element::relationship::RelationshipType;
use crate::model::diagram::diagram_plantuml::{
  serialize_elements_to_plantuml, DiagramElementType, DiagramPlantUML,
};
use crate::model::diagram::Diagram;
use crate::model::diagram::DiagramType;
use crate::model::file_search_results::FileSearchCategory;
use crate::repository::diagram_repository::{close_diagram, open_diagram};
use crate::service::search_service::search_diagram_element;
use convert_case::Case::Lower;
use convert_case::Casing;

/**
Returns the data of a diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
pub fn get_diagram(diagram_name: &str, diagram_type: DiagramType) -> Result<Diagram, MinaError> {
  let diagram = open_diagram(diagram_name, diagram_type.clone())?;
  close_diagram(diagram_name, diagram_type.clone())?;
  Ok(diagram)
}

/**
Checks a diagram satisfies all the requirements to be considerated as valid (e.g. syntax) .
Returns the validated diagram.
# Arguments
  * `raw_plantuml` - Raw PlantUML of the diagram to check.
  * `diagram_name` - Name of the diagram to check.
  * `diagram_type` - Type of the diagram to check.
*/
pub fn validate_diagram(
  raw_plantuml: &str,
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<DiagramPlantUML, MinaError> {
  // deserialize to check the given raw PlantUML has a valid syntax
  let diagram_plantuml = deserialize_plantuml_by_string(&raw_plantuml.to_string())?;
  // check that there are no duplicated aliases in the given diagram
  check_in_diagram_elements_aliases(&diagram_plantuml.elements)?;
  // check that in the given diagram there are no duplicated aliases across all the project's diagrams
  check_cross_diagrams_elements_aliases(
    &diagram_plantuml.elements,
    Some(diagram_name),
    Some(diagram_type),
  )?;
  return Ok(diagram_plantuml);
}

/**
Checks a diagram does not contain duplicated aliases.
Returns an error if the diagram contains duplicated aliases.
# Arguments
  * `diagram_plantuml_elements` - Diagram elements to check.
*/
pub fn check_in_diagram_elements_aliases(
  diagram_plantuml_elements: &Vec<DiagramElementType>,
) -> Result<(), MinaError> {
  let aliases = get_all_elements_aliases(&diagram_plantuml_elements);
  let mut map_aliases: HashSet<String> = HashSet::new();
  for alias in aliases {
    let added = map_aliases.insert(alias.clone());
    if !added {
      return Err(MinaError::new(
        DUPLICATED_ALIASES_IN_DIAGRAM_ERROR_CODE,
        &format!(
          "The alias \"{}\" is already present in the diagram. Please choose a different alias.",
          alias
        ),
      ));
    }
  }
  Ok(())
}

/**
Check that in the given diagram there are no duplicated aliases across all the project's diagrams
Returns an error if the diagram contains duplicated aliases.
# Arguments
  * `diagram_plantuml_elements` - Diagram elements to check.
  * `diagram_name` - Name of the diagram to check.
  * `diagram_type` - Type of the diagram to check.
*/
pub fn check_cross_diagrams_elements_aliases(
  diagram_plantuml_elements: &Vec<DiagramElementType>,
  diagram_name: Option<&str>,
  diagram_type: Option<&DiagramType>,
) -> Result<(), MinaError> {
  for element in diagram_plantuml_elements.clone() {
    let plantuml_diagram_elem_to_check = serialize_elements_to_plantuml(&vec![element.clone()], 0);

    // Exclude from the check relationships, boundaries, deployment nodes,
    // includes and comments since those are not architectural elements or elements
    // that can be shared across diagrams (so saved in the library).
    // Since boundaries and deployment nodes could contain nested elements, check them.
    let mut should_check = false;
    let mut alias_to_check: Option<String> = None;
    match element {
      DiagramElementType::Person(person) => {
        alias_to_check = person.base_data.alias;
        should_check = true;
      }
      DiagramElementType::SoftwareSystem(software_system) => {
        alias_to_check = software_system.base_data.alias;
        should_check = true;
      }
      DiagramElementType::Container(container) => {
        alias_to_check = container.base_data.alias;
        should_check = true;
      }
      DiagramElementType::Component(component) => {
        alias_to_check = component.base_data.alias;
        should_check = true;
      }
      DiagramElementType::Boundary(boundary) => {
        alias_to_check = boundary.base_data.alias;
        should_check = true;
        check_cross_diagrams_elements_aliases(&boundary.sub_elements, diagram_name, diagram_type)?;
      }
      DiagramElementType::DeploymentNode(deployment_node) => {
        alias_to_check = deployment_node.base_data.alias;
        should_check = true;
        check_cross_diagrams_elements_aliases(
          &deployment_node.sub_elements,
          diagram_name,
          diagram_type,
        )?;
      }
      DiagramElementType::Include(_) => (),
      DiagramElementType::Comment(_) => (),
      DiagramElementType::Relationship(_) => (),
    }
    if should_check {
      if let Some(alias) = alias_to_check {
        let search_diagram_elemen_result = search_diagram_element(
          &alias,
          &plantuml_diagram_elem_to_check,
          true,
          true,
          i32::MAX,
        )?;
        let mut partial_paths_found = vec![];
        for (path, search_results) in search_diagram_elemen_result.results {
          for seach_result in search_results {
            if seach_result.partial_match {
              if seach_result.category == FileSearchCategory::Diagram {
                let (found_diagram_name, found_diagram_type) = diagram_name_type_from_path(&path)?;
                if diagram_name.is_none()
                  || diagram_type.is_none()
                  || diagram_name.is_some_and(|diagram_name_value| {
                    found_diagram_name != diagram_name_value.to_string()
                  })
                  || diagram_type
                    .is_some_and(|diagram_type_value| found_diagram_type != *diagram_type_value)
                {
                  partial_paths_found.push(format!(
                    "diagrams/{}",
                    diagram_to_link_string(&found_diagram_name, &found_diagram_type)?
                  ));
                }
              } else if seach_result.category == FileSearchCategory::Library {
                partial_paths_found.push(format!(
                  "library/{}s",
                  element_type_from_path(&path)?.to_string().to_case(Lower)
                ));
              }
              break;
            }
          }
        }
        if partial_paths_found.len() > 0 {
          return Err(MinaError {
            code: DUPLICATED_ALIASES_IN_PROJECT_ERROR_CODE,
            msg: format!("The alias \"{}\" is already used with different attributes in the following diagram(s) and/or library element(s): {}.\n\nIf you intend to modify an element imported from the library, ensure that the modification is made within the library itself rather than within the diagram. Otherwise make sure to use a different alias.", alias, partial_paths_found.join(", ")),
          });
        }
      }
    }
  }
  Ok(())
}

/**
Retrieves the dependents of an architectural element with the given alias in the given diagram elements.
# Arguments
  * `alias` - Alias of the architectural element.
  * `diagram_plantuml_elements` - PlantUML elements of the diagram.
*/
pub fn find_dependent_elements_in_diagram(
  alias: &str,
  diagram_plantuml_elements: &Vec<DiagramElementType>,
) -> Result<Vec<String>, MinaError> {
  let l_to_r_rels = vec![
    RelationshipType::Rel,
    RelationshipType::RelNeighbor,
    RelationshipType::RelDown,
    RelationshipType::RelD,
    RelationshipType::RelUp,
    RelationshipType::RelU,
    RelationshipType::RelLeft,
    RelationshipType::RelL,
    RelationshipType::RelRight,
    RelationshipType::RelR,
  ];
  let r_to_l_rels = vec![RelationshipType::RelBackNeighbor, RelationshipType::RelBack];
  let bi_rels = vec![
    RelationshipType::BiRelNeighbor,
    RelationshipType::BiRelDown,
    RelationshipType::BiRelD,
    RelationshipType::BiRelUp,
    RelationshipType::BiRelU,
    RelationshipType::BiRelLeft,
    RelationshipType::BiRelL,
    RelationshipType::BiRelRight,
    RelationshipType::BiRelR,
    RelationshipType::BiRel,
  ];
  let mut dependents = vec![];
  for element in diagram_plantuml_elements.clone() {
    match element {
      DiagramElementType::Relationship(relationship) => {
        if let Some(rel_type) = relationship.relationship_type {
          if l_to_r_rels.contains(&rel_type) {
            if relationship.from == Some(alias.to_string()) && relationship.to.is_some() {
              dependents.push(relationship.to.unwrap());
            }
          } else if r_to_l_rels.contains(&rel_type) {
            if relationship.from.is_some() && relationship.to == Some(alias.to_string()) {
              dependents.push(relationship.from.unwrap());
            }
          } else if bi_rels.contains(&rel_type) {
            if relationship.from == Some(alias.to_string()) && relationship.to.is_some() {
              dependents.push(relationship.to.unwrap());
            } else if relationship.from.is_some() && relationship.to == Some(alias.to_string()) {
              dependents.push(relationship.from.unwrap());
            }
          }
        }
      }
      DiagramElementType::Boundary(boundary) => {
        dependents.append(&mut find_dependent_elements_in_diagram(
          alias,
          &boundary.sub_elements,
        )?);
      }
      DiagramElementType::DeploymentNode(deployment_node) => {
        dependents.append(&mut find_dependent_elements_in_diagram(
          alias,
          &deployment_node.sub_elements,
        )?);
      }
      _ => (),
    }
  }
  return Ok(dependents);
}

/**
Retrieves the dependents of an architectural element with the given alias in the given diagram.
# Arguments
  * `alias` - Alias of the architectural element.
  * `diagram_name` - Name of the diagram.
  * `diagram_type` - Type of the diagram.
*/
pub fn dependent_elements_in_diagram(
  alias: &str,
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<Vec<String>, MinaError> {
  let diagram = get_diagram(diagram_name, diagram_type)?;
  if let Some(diagram_plantuml) = diagram.diagram_plantuml {
    let dependents = find_dependent_elements_in_diagram(alias, &diagram_plantuml.elements)?;
    return Ok(dependents);
  } else {
    return Ok(vec![]);
  }
}
