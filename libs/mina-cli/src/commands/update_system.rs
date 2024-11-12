use crate::model::commands::update_system::UpdateSystem;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use keadex_mina::repository::library::library_repository::{
  search_library_element, update_element,
};

pub fn update_system(update_system_args: UpdateSystem) -> Result<(), MinaError> {
  let system = search_library_element(&update_system_args.alias)?;
  if let Some(found_system) = system {
    if let DiagramElementType::SoftwareSystem(found_system) = found_system {
      let old_system = found_system.clone();
      let mut new_system = found_system.clone();

      if update_system_args.new_label.is_some() {
        new_system.base_data.label = update_system_args.new_label;
      }
      if update_system_args.new_system_type.is_some() {
        new_system.system_type = update_system_args.new_system_type;
      }
      if update_system_args.new_description.is_some() {
        new_system.base_data.description = update_system_args.new_description;
      }
      if update_system_args.new_link.is_some() {
        new_system.base_data.link = update_system_args.new_link;
      }
      if update_system_args.new_notes.is_some() {
        new_system.base_data.notes = update_system_args.new_notes;
      }

      update_element(
        &DiagramElementType::SoftwareSystem(old_system),
        &DiagramElementType::SoftwareSystem(new_system),
      )?;
      return Ok(());
    }
  }
  return Err(MinaError::new(
    -1,
    &format!(
      "Software System with alias \"{}\" not found.",
      &update_system_args.alias
    ),
  ));
}
