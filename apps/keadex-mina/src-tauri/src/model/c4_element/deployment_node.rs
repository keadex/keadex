/*!
Model representing a C4 Deployment Node.
*/

use crate::core::serializer::format_with_indent;
use crate::model::diagram::diagram_plantuml::{
  parse_uml_element, serialize_elements_to_plantuml, PlantUMLSerializer,
};
use crate::model::{
  c4_element::base_element::BaseElement, diagram::diagram_plantuml::DiagramElementType,
};
use crate::parser::plantuml::plantuml_parser::Rule;
use bomboni_wasm::Wasm;
use pest::error::Error;
use pest::iterators::Pair;
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use strum_macros::{Display, EnumString};
use ts_rs::TS;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Display, Debug, EnumString, Clone, Wasm)]
#[wasm(wasm_abi)]
pub enum DeploymentNodeType {
  #[serde(rename = "Node")]
  #[strum(serialize = "Node")]
  Node,
  #[serde(rename = "Node_R")]
  #[strum(serialize = "Node_R")]
  NodeR,
  #[serde(rename = "Node_L")]
  #[strum(serialize = "Node_L")]
  NodeL,
  #[serde(rename = "Deployment_Node")]
  #[strum(serialize = "Deployment_Node")]
  DeploymentNode,
  #[serde(rename = "Deployment_Node_R")]
  #[strum(serialize = "Deployment_Node_R")]
  DeploymentNodeR,
  #[serde(rename = "Deployment_Node_L")]
  #[strum(serialize = "Deployment_Node_L")]
  DeploymentNodeL,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug, Default, Clone)]
#[wasm_bindgen(getter_with_clone)]
pub struct DeploymentNode {
  pub base_data: BaseElement,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub deploymeny_node_custom_type: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub deployment_node_type: Option<DeploymentNodeType>,
  pub sub_elements: Vec<DiagramElementType>,
}

impl<'i> TryFrom<Pair<'i, Rule>> for DeploymentNode {
  type Error = Error<Rule>;

  fn try_from(pair: Pair<Rule>) -> Result<Self, Self::Error> {
    let mut deployment_node = Self::default();

    let cloned_pair = pair.clone();
    deployment_node.base_data = cloned_pair.try_into().unwrap();

    let items = pair.into_inner();
    for item in items {
      match item.as_rule() {
        Rule::stdlib_c4_deployment_types => {
          deployment_node.deployment_node_type =
            Some(DeploymentNodeType::from_str(item.as_str()).unwrap())
        }
        Rule::stdlib_c4_type => {
          deployment_node.deploymeny_node_custom_type =
            Some(item.into_inner().next().unwrap().as_str().to_string())
        }
        Rule::uml_element => {
          parse_uml_element(
            item.into_inner().next().unwrap(),
            &mut deployment_node.sub_elements,
          );
        }
        _ => {}
      }
    }

    Ok(deployment_node)
  }
}

impl PlantUMLSerializer for DeploymentNode {
  fn serialize_to_plantuml(&self, level: usize) -> String {
    let mut deployment_node_ser = String::new();
    // Serialize "deployment node type"
    if let Some(deployment_node_type) = &self.deployment_node_type {
      deployment_node_ser.push_str(&format!("{}(", deployment_node_type));
    }
    // Serialize "alias"
    if let Some(alias) = &self.base_data.alias {
      deployment_node_ser.push_str(&format!("{}, ", alias));
    }
    // Serialize "label"
    if let Some(label) = &self.base_data.label {
      deployment_node_ser.push_str(&format!("\"{}\"", label));
    }
    // Serialize "custom type"
    if let Some(deploymeny_node_custom_type) = &self.deploymeny_node_custom_type {
      deployment_node_ser.push_str(&format!(", $type=\"{}\"", deploymeny_node_custom_type));
    }
    // Serialize "description"
    if let Some(description) = &self.base_data.description {
      deployment_node_ser.push_str(&format!(", \"{}\"", description));
    }
    // Serialize "sprite"
    if let Some(sprite) = &self.base_data.sprite {
      deployment_node_ser.push_str(&format!(", $sprite=\"{}\"", sprite));
    }
    // Serialize "tags"
    if let Some(tags) = &self.base_data.tags {
      deployment_node_ser.push_str(&format!(", $tags=\"{}\"", tags));
    }
    // Serialize "link"
    if let Some(link) = &self.base_data.link {
      deployment_node_ser.push_str(&format!(", $link=\"{}\"", link));
    }

    let sub_elements = serialize_elements_to_plantuml(&self.sub_elements, level + 1);
    let mut new_line = "";
    if sub_elements.eq("") {
      new_line = "\n";
    }
    deployment_node_ser.push_str(&format!(
      "){{{}{}{}",
      sub_elements,
      new_line,
      format_with_indent(level, "}".to_string())
    ));

    format_with_indent(level, deployment_node_ser)
  }
}
