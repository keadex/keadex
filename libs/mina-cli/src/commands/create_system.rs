use crate::model::commands::create_system::CreateSystem;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::c4_element::software_system::SoftwareSystem;
use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use keadex_mina::repository::library::library_repository::create_element;
use uuid::Uuid;

pub async fn create_system(args: CreateSystem) -> Result<(), MinaError> {
  let mut system = SoftwareSystem::default();
  system.base_data.uuid = Some(Uuid::new_v4().to_string());
  system.base_data.alias = Some(args.alias);
  system.base_data.description = args.description;
  system.base_data.label = Some(args.label);
  system.base_data.link = args.link;
  system.base_data.notes = args.notes;
  system.system_type = Some(args.system_type);

  create_element(&DiagramElementType::SoftwareSystem(system)).await?;
  return Ok(());
}
