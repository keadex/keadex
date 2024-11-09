use crate::model::commands::update_container::UpdateContainer;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use keadex_mina::repository::library::library_repository::{
  search_library_element, update_element,
};

pub fn update_container(update_container_args: UpdateContainer) -> Result<(), MinaError> {
  let container = search_library_element(&update_container_args.alias)?;
  if let Some(found_container) = container {
    if let DiagramElementType::Container(found_container) = found_container {
      let old_container = found_container.clone();
      let mut new_container = found_container.clone();

      if update_container_args.new_label.is_some() {
        new_container.base_data.label = update_container_args.new_label;
      }
      if update_container_args.new_container_type.is_some() {
        new_container.container_type = update_container_args.new_container_type;
      }
      if update_container_args.new_technology.is_some() {
        new_container.technology = update_container_args.new_technology;
      }
      if update_container_args.new_description.is_some() {
        new_container.base_data.description = update_container_args.new_description;
      }
      if update_container_args.new_link.is_some() {
        new_container.base_data.link = update_container_args.new_link;
      }
      if update_container_args.new_notes.is_some() {
        new_container.base_data.notes = update_container_args.new_notes;
      }

      update_element(
        &DiagramElementType::Container(old_container),
        &DiagramElementType::Container(new_container),
      )?;
      return Ok(());
    }
  }
  return Err(MinaError::new(
    -1,
    &format!(
      "Container with alias \"{}\" not found.",
      &update_container_args.alias
    ),
  ));
}
