/**
As for PlantUML specs, a relationship does not have an alias. But, for convenience, this utility
generates an alias also for a relationship. In this way, all C4 model elements have aliases.
# Arguments
  * `from` - Alias of the source element
  * `base_data` - Alias of the target element
*/
pub fn generate_relationship_alias(alias_from: &str, alias_to: &str) -> String {
  format!("{} -> {}", alias_from, alias_to)
}
