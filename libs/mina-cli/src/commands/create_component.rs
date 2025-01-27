use crate::model::commands::create_component::CreateComponent;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::c4_element::component::Component;
use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use keadex_mina::repository::library::library_repository::create_element;
use uuid::Uuid;

pub async fn create_component(args: CreateComponent) -> Result<(), MinaError> {
  let mut component = Component::default();
  component.base_data.uuid = Some(Uuid::new_v4().to_string());
  component.base_data.alias = Some(args.alias);
  component.base_data.description = args.description;
  component.base_data.label = Some(args.label);
  component.base_data.link = args.link;
  component.base_data.notes = args.notes;
  component.component_type = Some(args.component_type);
  component.technology = Some(args.technology);

  create_element(&DiagramElementType::Component(component)).await?;
  return Ok(());
}
