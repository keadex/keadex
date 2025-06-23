use crate::model::commands::update_component::UpdateComponent;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use keadex_mina::repository::library::library_repository::{
  search_library_element, update_element,
};

pub async fn update_component(update_component_args: UpdateComponent) -> Result<(), MinaError> {
  let component = search_library_element(&update_component_args.alias).await?;
  if let Some(found_component) = component {
    if let DiagramElementType::Component(found_component) = found_component {
      let old_component = found_component.clone();
      let mut new_component = found_component.clone();

      if update_component_args.new_label.is_some() {
        new_component.base_data.label = update_component_args.new_label;
      }
      if update_component_args.new_component_type.is_some() {
        new_component.component_type = update_component_args.new_component_type;
      }
      if update_component_args.new_technology.is_some() {
        new_component.technology = update_component_args.new_technology;
      }
      if update_component_args.new_description.is_some() {
        new_component.base_data.description = update_component_args.new_description;
      }
      if update_component_args.new_link.is_some() {
        new_component.base_data.link = update_component_args.new_link;
      }
      if update_component_args.new_notes.is_some() {
        new_component.base_data.notes = update_component_args.new_notes;
      }

      update_element(
        &DiagramElementType::Component(old_component),
        &DiagramElementType::Component(new_component),
      )
      .await?;
      return Ok(());
    }
  }
  return Err(MinaError::new(
    -1,
    &format!(
      "Component with alias \"{}\" not found.",
      &update_component_args.alias
    ),
  ));
}
