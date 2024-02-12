/*!
Model representing the root of a PlantUML diagram.
*/

use crate::model::c4_element::boundary::Boundary;
use crate::model::c4_element::component::{Component, ComponentType};
use crate::model::c4_element::container::{Container, ContainerType};
use crate::model::c4_element::deployment_node::DeploymentNode;
use crate::model::c4_element::person::{Person, PersonType};
use crate::model::c4_element::relationship::Relationship;
use crate::model::c4_element::software_system::{SoftwareSystem, SystemType};
use crate::parser::plantuml::plantuml_parser::Rule;
use bomboni_wasm::Wasm;
use pest::error::Error;
use pest::iterators::{Pair, Pairs};
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use strum_macros::Display;
use ts_rs::TS;
use wasm_bindgen::prelude::wasm_bindgen;

pub trait PlantUMLSerializer {
  fn serialize_to_plantuml(&self) -> String;
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Display, Debug, Clone, Wasm)]
#[wasm(wasm_abi)]
pub enum DiagramElementType {
  Include(String),
  Comment(String),
  Person(Person),
  SoftwareSystem(SoftwareSystem),
  Container(Container),
  Component(Component),
  Boundary(Boundary),
  DeploymentNode(DeploymentNode),
  Relationship(Relationship),
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[wasm_bindgen(getter_with_clone)]
pub struct DiagramPlantUML {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub diagram_id: Option<String>,
  pub elements: Vec<DiagramElementType>,
}

impl<'i> TryFrom<Pair<'i, Rule>> for DiagramPlantUML {
  type Error = Error<Rule>;

  fn try_from(pair: Pair<Rule>) -> Result<Self, Self::Error> {
    let mut plantuml_iterator = pair.into_inner();
    let diagrams = plantuml_iterator.next().unwrap();
    let diagrams_iterator = diagrams.into_inner();
    let mut diagram_id = None;
    let mut elements: Vec<DiagramElementType> = vec![];
    for item in diagrams_iterator {
      match item.as_rule() {
        Rule::diagram_id => {
          diagram_id = Some(item.into_inner().next().unwrap().as_str().to_string());
        }
        Rule::uml => parse_uml_elements(item.into_inner(), &mut elements),
        _ => {}
      }
    }
    Ok(Self {
      diagram_id,
      elements,
    })
  }
}

// ------ Parser for UML Elements
fn parse_uml_elements(pairs: Pairs<Rule>, elements: &mut Vec<DiagramElementType>) {
  for item in pairs {
    let concrete_uml_element = item.into_inner().next().unwrap();
    parse_uml_element(concrete_uml_element, elements);
  }
}

// ------ Parser for single UML Element
pub fn parse_uml_element(pair: Pair<Rule>, elements: &mut Vec<DiagramElementType>) {
  match pair.as_rule() {
    Rule::include => {
      elements.push(DiagramElementType::Include(
        pair.into_inner().next().unwrap().as_str().to_string(),
      ));
    }
    Rule::comment => {
      elements.push(DiagramElementType::Comment(pair.as_str().to_string()));
    }
    Rule::stdlib_c4_context => {
      if let Some(parsed_element) = parse_stdlib_c4_context(pair) {
        elements.push(parsed_element);
      }
    }
    Rule::stdlib_c4_container_component => {
      if let Some(parsed_element) = parse_stdlib_c4_container_component(pair) {
        elements.push(parsed_element);
      }
    }
    Rule::stdlib_c4_boundary => {
      elements.push(DiagramElementType::Boundary(pair.try_into().unwrap()));
    }
    Rule::stdlib_c4_dynamic_rel => {
      elements.push(DiagramElementType::Relationship(pair.try_into().unwrap()));
    }
    Rule::stdlib_c4_deployment => {
      elements.push(DiagramElementType::DeploymentNode(pair.try_into().unwrap()));
    }
    _ => {}
  }
}

// ------ Parser for Context & Person rule
fn parse_stdlib_c4_context(pair: Pair<Rule>) -> Option<DiagramElementType> {
  let cloned_pair = pair.clone();

  let stdlib_c4_context_types = pair.into_inner().next().unwrap();

  // check if it is a person
  let enum_value = PersonType::from_str(stdlib_c4_context_types.as_str());
  if let Ok(_) = enum_value {
    return Some(DiagramElementType::Person(cloned_pair.try_into().unwrap()));
  }

  // check if it is a system
  let enum_value = SystemType::from_str(stdlib_c4_context_types.as_str());
  if let Ok(_) = enum_value {
    return Some(DiagramElementType::SoftwareSystem(
      cloned_pair.try_into().unwrap(),
    ));
  }

  return None;
}

// ------ Parser for Container & Component rule
fn parse_stdlib_c4_container_component(pair: Pair<Rule>) -> Option<DiagramElementType> {
  let cloned_pair = pair.clone();

  let stdlib_c4_container_component_types = pair.into_inner().next().unwrap();

  // check if it is a container
  let enum_value = ContainerType::from_str(stdlib_c4_container_component_types.as_str());
  if let Ok(_) = enum_value {
    return Some(DiagramElementType::Container(
      cloned_pair.try_into().unwrap(),
    ));
  }

  // check if it is a component
  let enum_value = ComponentType::from_str(stdlib_c4_container_component_types.as_str());
  if let Ok(_) = enum_value {
    return Some(DiagramElementType::Component(
      cloned_pair.try_into().unwrap(),
    ));
  }

  return None;
}

impl PlantUMLSerializer for DiagramPlantUML {
  fn serialize_to_plantuml(&self) -> String {
    // Serialize "diagram id"
    let mut diagram_id_ser = String::from("");
    if let Some(diagram_id) = &self.diagram_id {
      diagram_id_ser = format!("(id={})", diagram_id);
    }
    // Serialize "diagram elements"
    let elements_ser = serialize_elements_to_plantuml(&self.elements, "");

    format!("@startuml{}\n\n{}\n@enduml", diagram_id_ser, elements_ser)
  }
}

/**
Serializes a vector of elements to PlantUML
# Arguments
  * `elements` - Vector of elements
*/
pub fn serialize_elements_to_plantuml(
  elements: &Vec<DiagramElementType>,
  indent_spaces: &str,
) -> String {
  let mut elements_ser = String::new();
  for element in elements {
    match element {
      DiagramElementType::Include(uri) => {
        elements_ser.push_str(&format!("{}!include {}\n\n", indent_spaces, uri))
      }
      DiagramElementType::Comment(comment) => {
        elements_ser.push_str(&format!("{}{}\n", indent_spaces, comment))
      }
      DiagramElementType::Person(person) => elements_ser.push_str(&format!(
        "{}{}\n\n",
        indent_spaces,
        person.serialize_to_plantuml()
      )),
      DiagramElementType::SoftwareSystem(software_system) => elements_ser.push_str(&format!(
        "{}{}\n\n",
        indent_spaces,
        software_system.serialize_to_plantuml()
      )),
      DiagramElementType::Container(container) => elements_ser.push_str(&format!(
        "{}{}\n\n",
        indent_spaces,
        container.serialize_to_plantuml()
      )),
      DiagramElementType::Component(component) => elements_ser.push_str(&format!(
        "{}{}\n\n",
        indent_spaces,
        component.serialize_to_plantuml()
      )),
      DiagramElementType::Boundary(boundary) => elements_ser.push_str(&format!(
        "{}{}\n\n",
        indent_spaces,
        boundary.serialize_to_plantuml()
      )),
      DiagramElementType::DeploymentNode(deployment_node) => elements_ser.push_str(&format!(
        "{}{}\n\n",
        indent_spaces,
        deployment_node.serialize_to_plantuml()
      )),
      DiagramElementType::Relationship(relationship) => elements_ser.push_str(&format!(
        "{}{}\n\n",
        indent_spaces,
        relationship.serialize_to_plantuml()
      )),
    }
  }
  elements_ser
}
