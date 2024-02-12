/*!
Model representing a C4 Container element.
*/

use crate::model::{
  c4_element::base_element::BaseElement, diagram::diagram_plantuml::PlantUMLSerializer,
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
pub enum ContainerType {
  #[serde(rename = "Container")]
  #[strum(serialize = "Container")]
  Container,
  #[serde(rename = "Container_Ext")]
  #[strum(serialize = "Container_Ext")]
  ContainerExt,
  #[serde(rename = "ContainerDb")]
  #[strum(serialize = "ContainerDb")]
  ContainerDb,
  #[serde(rename = "ContainerDb_Ext")]
  #[strum(serialize = "ContainerDb_Ext")]
  ContainerDbExt,
  #[serde(rename = "ContainerQueue")]
  #[strum(serialize = "ContainerQueue")]
  ContainerQueue,
  #[serde(rename = "ContainerQueue_Ext")]
  #[strum(serialize = "ContainerQueue_Ext")]
  ContainerQueueExt,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug, Default, Clone)]
#[wasm_bindgen(getter_with_clone)]
pub struct Container {
  pub base_data: BaseElement,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub technology: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub container_type: Option<ContainerType>,
}

impl<'i> TryFrom<Pair<'i, Rule>> for Container {
  type Error = Error<Rule>;

  fn try_from(pair: Pair<Rule>) -> Result<Self, Self::Error> {
    let mut container = Self::default();

    let cloned_pair = pair.clone();
    container.base_data = cloned_pair.try_into().unwrap();

    let items = pair.into_inner();
    for item in items {
      match item.as_rule() {
        Rule::stdlib_c4_container_component_types => {
          container.container_type = Some(ContainerType::from_str(item.as_str()).unwrap())
        }
        Rule::stdlib_c4_techn => {
          container.technology = Some(item.into_inner().next().unwrap().as_str().to_string())
        }
        _ => {}
      }
    }

    Ok(container)
  }
}

impl PlantUMLSerializer for Container {
  fn serialize_to_plantuml(&self) -> String {
    let mut container_ser = String::new();
    // Serialize "container type"
    if let Some(container_type) = &self.container_type {
      container_ser.push_str(&format!("{}(", container_type));
    }
    // Serialize "alias"
    if let Some(alias) = &self.base_data.alias {
      container_ser.push_str(&format!("{}, ", alias));
    }
    // Serialize "label"
    if let Some(label) = &self.base_data.label {
      container_ser.push_str(&format!("\"{}\"", label));
    }
    // Serialize "technology"
    if let Some(technology) = &self.technology {
      container_ser.push_str(&format!(", \"{}\"", technology));
    }
    // Serialize "description"
    if let Some(description) = &self.base_data.description {
      container_ser.push_str(&format!(", \"{}\"", description));
    }
    // Serialize "sprite"
    if let Some(sprite) = &self.base_data.sprite {
      container_ser.push_str(&format!(", $sprite=\"{}\"", sprite));
    }
    // Serialize "tags"
    if let Some(tags) = &self.base_data.tags {
      container_ser.push_str(&format!(", $tags=\"{}\"", tags));
    }
    // Serialize "link"
    if let Some(link) = &self.base_data.link {
      container_ser.push_str(&format!(", $link=\"{}\"", link));
    }
    container_ser.push_str(")");
    container_ser
  }
}
