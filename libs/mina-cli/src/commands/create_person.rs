use crate::model::commands::create_person::CreatePerson;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::c4_element::person::Person;
use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use keadex_mina::repository::library::library_repository::create_element;
use uuid::Uuid;

pub async fn create_person(args: CreatePerson) -> Result<(), MinaError> {
  let mut person = Person::default();
  person.base_data.uuid = Some(Uuid::new_v4().to_string());
  person.base_data.alias = Some(args.alias);
  person.base_data.description = args.description;
  person.base_data.label = Some(args.label);
  person.base_data.notes = args.notes;
  person.person_type = Some(args.person_type);

  create_element(&DiagramElementType::Person(person)).await?;
  return Ok(());
}
