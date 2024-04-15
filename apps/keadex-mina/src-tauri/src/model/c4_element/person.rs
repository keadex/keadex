/*!
Model representing a Person entity.
*/

use crate::core::serializer::format_with_indent;
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
pub enum PersonType {
  #[serde(rename = "Person")]
  #[strum(serialize = "Person")]
  Person,
  #[serde(rename = "Person_Ext")]
  #[strum(serialize = "Person_Ext")]
  PersonExt,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[wasm_bindgen(getter_with_clone)]
#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Person {
  pub base_data: BaseElement,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub person_type: Option<PersonType>,
}

impl<'i> TryFrom<Pair<'i, Rule>> for Person {
  type Error = Error<Rule>;

  fn try_from(pair: Pair<Rule>) -> Result<Self, Self::Error> {
    let mut person = Self::default();

    let cloned_pair = pair.clone();
    person.base_data = cloned_pair.try_into().unwrap();

    let items = pair.into_inner();
    for item in items {
      match item.as_rule() {
        Rule::stdlib_c4_context_types => {
          person.person_type = Some(PersonType::from_str(item.as_str()).unwrap())
        }
        _ => {}
      }
    }

    Ok(person)
  }
}

impl PlantUMLSerializer for Person {
  fn serialize_to_plantuml(&self, level: usize) -> String {
    let mut person_ser = String::new();
    // Serialize "person type"
    if let Some(person_type) = &self.person_type {
      person_ser.push_str(&format!("{}(", person_type));
    }
    // Serialize "alias"
    if let Some(alias) = &self.base_data.alias {
      person_ser.push_str(&format!("{}, ", alias));
    }
    // Serialize "label"
    if let Some(label) = &self.base_data.label {
      person_ser.push_str(&format!("\"{}\"", label));
    }
    // Serialize "description"
    if let Some(description) = &self.base_data.description {
      person_ser.push_str(&format!(", \"{}\"", description));
    }
    // Serialize "sprite"
    if let Some(sprite) = &self.base_data.sprite {
      person_ser.push_str(&format!(", $sprite=\"{}\"", sprite));
    }
    // Serialize "tags"
    if let Some(tags) = &self.base_data.tags {
      person_ser.push_str(&format!(", $tags=\"{}\"", tags));
    }
    // Serialize "link"
    if let Some(link) = &self.base_data.link {
      person_ser.push_str(&format!(", $link=\"{}\"", link));
    }
    person_ser.push_str(")");

    format_with_indent(level, person_ser)
  }
}
