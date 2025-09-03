use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::ProjectAliasesIMDAO;
use crate::core::serializer::deserialize_plantuml_by_string;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::errors::{
  DUPLICATED_ALIASES_IN_DIAGRAM_ERROR_CODE, DUPLICATED_ALIASES_IN_PROJECT_ERROR_CODE,
};
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::{
  clean_plantuml_diagram_element, extract_diagram_aggregated_details,
};
use crate::helper::project_helper::project_aliases_diagram_key;
use crate::model::c4_element::relationship::RelationshipType;
use crate::model::diagram::diagram_plantuml::{
  serialize_elements_to_plantuml, DiagramElementType, DiagramPlantUML,
};
use crate::model::diagram::Diagram;
use crate::model::diagram::DiagramType;
use crate::repository::diagram_repository::{close_diagram, open_diagram};
use crate::resolve_to_write;
use std::collections::HashSet;

/**
Returns the data of a diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
pub async fn get_diagram(
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<Diagram, MinaError> {
  let diagram = open_diagram(diagram_name, diagram_type.clone()).await?;
  close_diagram(diagram_name, diagram_type.clone()).await?;
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
pub async fn validate_diagram(
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
  )
  .await?;
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
  let aliases = extract_diagram_aggregated_details(&diagram_plantuml_elements, false).aliases;
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
pub async fn check_cross_diagrams_elements_aliases(
  diagram_plantuml_elements: &Vec<DiagramElementType>,
  diagram_name: Option<&str>,
  diagram_type: Option<&DiagramType>,
) -> Result<(), MinaError> {
  let diagram_key_to_check =
    if let (Some(diag_name_to_check), Some(diag_type_to_check)) = (diagram_name, diagram_type) {
      Some(project_aliases_diagram_key(
        diag_name_to_check,
        diag_type_to_check,
      ))
    } else {
      None
    };

  let store = ROOT_RESOLVER.get().read().await;
  let aliases = resolve_to_write!(store, ProjectAliasesIMDAO)
    .await
    .get()
    .await
    .unwrap();

  let mut partial_paths_found = vec![];
  for element in diagram_plantuml_elements {
    let plantuml_diagram_element = serialize_elements_to_plantuml(&vec![element.clone()], 0);
    let cleaned_plantuml_diagram_element =
      clean_plantuml_diagram_element(&plantuml_diagram_element)?;

    // Exclude from the check relationships, boundaries, deployment nodes,
    // includes and comments since those are not architectural elements or elements
    // that can be shared across diagrams (so saved in the library).
    // Since boundaries and deployment nodes could contain nested elements, check them.
    let mut should_check = false;
    let mut alias_to_check: Option<String> = None;
    match element {
      DiagramElementType::Person(person) => {
        alias_to_check = person.base_data.alias.clone();
        should_check = true;
      }
      DiagramElementType::SoftwareSystem(software_system) => {
        alias_to_check = software_system.base_data.alias.clone();
        should_check = true;
      }
      DiagramElementType::Container(container) => {
        alias_to_check = container.base_data.alias.clone();
        should_check = true;
      }
      DiagramElementType::Component(component) => {
        alias_to_check = component.base_data.alias.clone();
        should_check = true;
      }
      DiagramElementType::Boundary(boundary) => {
        alias_to_check = boundary.base_data.alias.clone();
        should_check = true;
        Box::pin(check_cross_diagrams_elements_aliases(
          &boundary.sub_elements,
          diagram_name,
          diagram_type,
        ))
        .await?;
      }
      DiagramElementType::DeploymentNode(deployment_node) => {
        alias_to_check = deployment_node.base_data.alias.clone();
        should_check = true;
        Box::pin(check_cross_diagrams_elements_aliases(
          &deployment_node.sub_elements,
          diagram_name,
          diagram_type,
        ))
        .await?;
      }
      DiagramElementType::Include(_) => (),
      DiagramElementType::Comment(_) => (),
      DiagramElementType::AddElementTag(_) => (),
      DiagramElementType::Relationship(_) => (),
    }
    if should_check {
      if let Some(alias) = alias_to_check {
        for project_aliases in aliases.clone() {
          // Skip checking the diagram being validated
          // diagram_key_to_check is None when validating a library element
          if diagram_key_to_check
            .clone()
            .is_none_or(|key| key != project_aliases.0)
          {
            for project_alias in project_aliases.1 {
              if project_alias.alias == alias {
                if let Some(stored_element) = project_alias.element {
                  let plantuml_stored_diagram_element =
                    serialize_elements_to_plantuml(&vec![stored_element.clone()], 0);
                  let cleaned_plantuml_stored_diagram_element =
                    clean_plantuml_diagram_element(&plantuml_stored_diagram_element)?;

                  // Check if the stored element (corresponding to the alias to check) matches exactly
                  // the PlantUML of the element to check.
                  // If it does not match, this means the alias has been used for another diagram element, which is prohibited.
                  //
                  // In theory, you should check if the two strings are equal. But by doing so, elements
                  // with nested elements will be excluded:
                  //    - cleaned_plantuml_diagram_element:
                  //        "System_Boundary(boundary, "boundary") {
                  //
                  //         }"
                  //    - cleaned_plantuml_stored_diagram_element:
                  //        "System_Boundary(boundary, "boundary") {"
                  //    - cleaned_plantuml_diagram_element !== cleaned_plantuml_stored_diagram_element
                  //
                  // By using the "starts with" condition you cover also this case.
                  //    - cleaned_plantuml_diagram_element starts with cleaned_plantuml_stored_diagram_element
                  if !cleaned_plantuml_diagram_element
                    .starts_with(&cleaned_plantuml_stored_diagram_element)
                  {
                    partial_paths_found.push(project_aliases.0.clone());
                    break;
                  }
                }
              }
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
pub async fn dependent_elements_in_diagram(
  alias: &str,
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<Vec<String>, MinaError> {
  let diagram = get_diagram(diagram_name, diagram_type).await?;
  if let Some(diagram_plantuml) = diagram.diagram_plantuml {
    let dependents = find_dependent_elements_in_diagram(alias, &diagram_plantuml.elements)?;
    return Ok(dependents);
  } else {
    return Ok(vec![]);
  }
}
