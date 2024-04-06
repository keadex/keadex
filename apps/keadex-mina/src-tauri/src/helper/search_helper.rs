use crate::model::c4_element::relationship::RelationshipType;
use fancy_regex::Regex;
use strum::IntoEnumIterator;

/**
Creates the regex can be used to search for a diagram element with the given alias in a PlantUML file.
The returned regex does not match relationships and comments since they do not have aliases.
# Arguments
  * `alias` - Alias of the diagram element to search for.
# Returns
  * Regex
*/
pub fn create_search_diagram_elem_in_plantuml_regex(alias: &str) -> Regex {
  let mut re_string: String = r"^(?!(?:".to_owned();
  // Exclude from the search relationships and comments since they do not have aliases
  for rel_type in RelationshipType::iter() {
    re_string.push_str(&format!("{}|", &rel_type.to_string()));
  }
  re_string.push_str(&format!("'|/'))\\w* *\\({},", alias));

  return Regex::new(&re_string).unwrap();
}

/**
Creates the regex can be used to search for a diagram element with the given alias in a JSON file.
# Arguments
  * `alias` - Alias of the diagram element to search for.
# Returns
  * Regex
*/
pub fn create_search_diagram_elem_in_json_regex(alias: &str) -> Regex {
  let mut re_string: String = r#"^ *"alias": ""#.to_owned();
  re_string.push_str(&format!("{}\",$", alias));

  return Regex::new(&re_string).unwrap();
}
