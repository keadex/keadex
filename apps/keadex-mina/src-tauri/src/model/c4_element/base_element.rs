/*!
Model representing the data shared between all the diagram's entities (Container, Person, Software System, etc.).
*/

use crate::parser::plantuml::plantuml_parser::Rule;
use pest::error::Error;
use pest::iterators::Pair;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(TS)]
#[ts(
  export,
  export_to = "../../../libs/c4-model-ui-kit/src/models/autogenerated/"
)]
#[derive(Serialize, Deserialize, Debug, Default, Clone)]
#[wasm_bindgen(getter_with_clone)]
pub struct BaseElement {
  #[serde(skip_serializing_if = "Option::is_none")]
  pub alias: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub label: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub description: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub sprite: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub tags: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub link: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub uuid: Option<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  pub notes: Option<String>,
}

impl<'i> TryFrom<Pair<'i, Rule>> for BaseElement {
  type Error = Error<Rule>;

  fn try_from(pair: Pair<Rule>) -> Result<Self, Self::Error> {
    let mut base_element = Self::default();
    let items = pair.into_inner();
    for item in items {
      match item.as_rule() {
        Rule::stdlib_c4_alias => {
          base_element.alias = Some(item.into_inner().next().unwrap().as_str().to_string())
        }
        Rule::stdlib_c4_label => {
          // In the Pest grammar, the label can be empty, so we check for that
          // and force it to be a space if it is empty.
          // This is to avoid issues with diagram rendering.
          let label = item.into_inner().next().unwrap().as_str().to_string();
          if label.is_empty() {
            base_element.label = Some(String::from(" "));
          } else {
            base_element.label = Some(label);
          }
        }
        Rule::stdlib_c4_descr => {
          base_element.description = Some(item.into_inner().next().unwrap().as_str().to_string())
        }
        Rule::stdlib_c4_sprite => {
          base_element.sprite = Some(item.into_inner().next().unwrap().as_str().to_string())
        }
        Rule::stdlib_c4_tags => {
          base_element.tags = Some(item.into_inner().next().unwrap().as_str().to_string())
        }
        Rule::stdlib_c4_link => {
          base_element.link = Some(item.into_inner().next().unwrap().as_str().to_string())
        }
        _ => {}
      }
    }
    Ok(base_element)
  }
}
