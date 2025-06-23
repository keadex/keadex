use crate::model::commands::create_container::CreateContainer;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::c4_element::container::Container;
use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use keadex_mina::repository::library::library_repository::create_element;
use uuid::Uuid;

pub async fn create_container(args: CreateContainer) -> Result<(), MinaError> {
  let mut container = Container::default();
  container.base_data.uuid = Some(Uuid::new_v4().to_string());
  container.base_data.alias = Some(args.alias);
  container.base_data.description = args.description;
  container.base_data.label = Some(args.label);
  container.base_data.link = args.link;
  container.base_data.notes = args.notes;
  container.container_type = Some(args.container_type);
  container.technology = Some(args.technology);

  create_element(&DiagramElementType::Container(container)).await?;
  return Ok(());
}
