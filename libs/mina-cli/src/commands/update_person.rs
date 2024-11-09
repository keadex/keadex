use crate::model::commands::update_person::UpdatePerson;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use keadex_mina::repository::library::library_repository::{
  search_library_element, update_element,
};

pub fn update_person(update_person_args: UpdatePerson) -> Result<(), MinaError> {
  let person = search_library_element(&update_person_args.alias)?;
  if let Some(found_person) = person {
    if let DiagramElementType::Person(found_person) = found_person {
      let old_person = found_person.clone();
      let mut new_person = found_person.clone();

      if update_person_args.new_label.is_some() {
        new_person.base_data.label = update_person_args.new_label;
      }
      if update_person_args.new_person_type.is_some() {
        new_person.person_type = update_person_args.new_person_type;
      }
      if update_person_args.new_description.is_some() {
        new_person.base_data.description = update_person_args.new_description;
      }
      if update_person_args.new_notes.is_some() {
        new_person.base_data.notes = update_person_args.new_notes;
      }

      update_element(
        &DiagramElementType::Person(old_person),
        &DiagramElementType::Person(new_person),
      )?;
      return Ok(());
    }
  }
  return Err(MinaError::new(
    -1,
    &format!(
      "Person with alias \"{}\" not found.",
      &update_person_args.alias
    ),
  ));
}
