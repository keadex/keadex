/*!
Model representing a C4 Boundary element.
*/

use crate::model::c4_element::base_element::BaseElement;
use crate::model::diagram::diagram_plantuml::{
  parse_uml_element, serialize_elements_to_plantuml, DiagramElementType, PlantUMLSerializer,
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
pub enum BoundaryType {
  #[serde(rename = "Enterprise_Boundary")]
  #[strum(serialize = "Enterprise_Boundary")]
  EnterpriseBoundary,
  #[serde(rename = "System_Boundary")]
  #[strum(serialize = "System_Boundary")]
  SystemBoundary,
  #[serde(rename = "Container_Boundary")]
  #[strum(serialize = "Container_Boundary")]
  ContainerBoundary,
  #[serde(rename = "Boundary")]
  #[strum(serialize = "Boundary")]
  Boundary,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug, Default, Clone)]
#[wasm_bindgen(getter_with_clone)]
pub struct Boundary {
  pub base_data: BaseElement,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub boundary_type: Option<BoundaryType>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub boundary_custom_type: Option<String>,
  pub sub_elements: Vec<DiagramElementType>,
}

impl<'i> TryFrom<Pair<'i, Rule>> for Boundary {
  type Error = Error<Rule>;

  fn try_from(pair: Pair<Rule>) -> Result<Self, Self::Error> {
    let mut boundary = Self::default();

    let cloned_pair = pair.clone();
    boundary.base_data = cloned_pair.try_into().unwrap();

    let items = pair.into_inner();
    for item in items {
      match item.as_rule() {
        Rule::stdlib_c4_boundary_types => {
          boundary.boundary_type = Some(BoundaryType::from_str(item.as_str()).unwrap())
        }
        Rule::stdlib_c4_type => {
          boundary.boundary_custom_type =
            Some(item.into_inner().next().unwrap().as_str().to_string())
        }
        Rule::uml_element => {
          parse_uml_element(
            item.into_inner().next().unwrap(),
            &mut boundary.sub_elements,
          );
        }
        _ => {}
      }
    }

    if let None = boundary.boundary_type {
      boundary.boundary_type = Some(BoundaryType::Boundary);
    }

    Ok(boundary)
  }
}

impl PlantUMLSerializer for Boundary {
  fn serialize_to_plantuml(&self) -> String {
    let mut boundary_ser = String::new();
    // Serialize "boundary type"
    if let Some(boundary_type) = &self.boundary_type {
      boundary_ser.push_str(&format!("{}(", boundary_type));
    }
    // Serialize "alias"
    if let Some(alias) = &self.base_data.alias {
      boundary_ser.push_str(&format!("{}, ", alias));
    }
    // Serialize "label"
    if let Some(label) = &self.base_data.label {
      boundary_ser.push_str(&format!("\"{}\"", label));
    }
    // Serialize "custom type"
    if let Some(boundary_custom_type) = &self.boundary_custom_type {
      boundary_ser.push_str(&format!(", $type=\"{}\"", boundary_custom_type));
    }
    // Serialize "tags"
    if let Some(tags) = &self.base_data.tags {
      boundary_ser.push_str(&format!(", $tags=\"{}\"", tags));
    }
    // Serialize "link"
    if let Some(link) = &self.base_data.link {
      boundary_ser.push_str(&format!(", $link=\"{}\"", link));
    }
    boundary_ser.push_str(&format!(
      "){{\n{}}}",
      serialize_elements_to_plantuml(&self.sub_elements, "\t")
    ));
    boundary_ser
  }
}
