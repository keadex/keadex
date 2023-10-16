/*!
Model representing a C4 Software System element.
*/

use crate::model::{
  c4_element::base_element::BaseElement, diagram::diagram_plantuml::PlantUMLSerializer,
};
use crate::parser::plantuml::plantuml_parser::Rule;
use pest::error::Error;
use pest::iterators::Pair;
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use strum_macros::{Display, EnumString};
use ts_rs::TS;

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Display, Debug, EnumString, Clone)]
pub enum SystemType {
  #[serde(rename = "System")]
  #[strum(serialize = "System")]
  System,
  #[serde(rename = "System_Ext")]
  #[strum(serialize = "System_Ext")]
  SystemExt,
  #[serde(rename = "SystemDb")]
  #[strum(serialize = "SystemDb")]
  SystemDb,
  #[serde(rename = "SystemDb_Ext")]
  #[strum(serialize = "SystemDb_Ext")]
  SystemDbExt,
  #[serde(rename = "SystemQueue")]
  #[strum(serialize = "SystemQueue")]
  SystemQueue,
  #[serde(rename = "SystemQueue_Ext")]
  #[strum(serialize = "SystemQueue_Ext")]
  SystemQueueExt,
}

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct SoftwareSystem {
  pub base_data: BaseElement,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub system_type: Option<SystemType>,
}

impl<'i> TryFrom<Pair<'i, Rule>> for SoftwareSystem {
  type Error = Error<Rule>;

  fn try_from(pair: Pair<Rule>) -> Result<Self, Self::Error> {
    let mut software_system = Self::default();

    let cloned_pair = pair.clone();
    software_system.base_data = cloned_pair.try_into().unwrap();

    let items = pair.into_inner();
    for item in items {
      match item.as_rule() {
        Rule::stdlib_c4_context_types => {
          software_system.system_type = Some(SystemType::from_str(item.as_str()).unwrap())
        }
        _ => {}
      }
    }

    Ok(software_system)
  }
}

impl PlantUMLSerializer for SoftwareSystem {
  fn serialize_to_plantuml(&self) -> String {
    let mut system_ser = String::new();
    // Serialize "system type"
    if let Some(system_type) = &self.system_type {
      system_ser.push_str(&format!("{}(", system_type));
    }
    // Serialize "alias"
    if let Some(alias) = &self.base_data.alias {
      system_ser.push_str(&format!("{}, ", alias));
    }
    // Serialize "label"
    if let Some(label) = &self.base_data.label {
      system_ser.push_str(&format!("\"{}\"", label));
    }
    // Serialize "description"
    if let Some(description) = &self.base_data.description {
      system_ser.push_str(&format!(", \"{}\"", description));
    }
    // Serialize "sprite"
    if let Some(sprite) = &self.base_data.sprite {
      system_ser.push_str(&format!(", $sprite=\"{}\"", sprite));
    }
    // Serialize "tags"
    if let Some(tags) = &self.base_data.tags {
      system_ser.push_str(&format!(", $tags=\"{}\"", tags));
    }
    // Serialize "link"
    if let Some(link) = &self.base_data.link {
      system_ser.push_str(&format!(", $link=\"{}\"", link));
    }
    system_ser.push_str(")");
    system_ser
  }
}
