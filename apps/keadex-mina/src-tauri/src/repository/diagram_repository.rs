/*!
Diagram Repository.
Module which exposes functions to access/alter Diagrams data.
Under the hood it uses DAOs.
*/

use crate::api::filesystem::FileSystemAPI as FsApiTrait;
use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::BinaryFsDAO;
use crate::core::resolver::ResolvableModules::DiagramPlantUMLFsDAO;
use crate::core::resolver::ResolvableModules::DiagramSpecFsDAO;
use crate::core::resolver::ResolvableModules::FileSystemAPI;
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::core::serializer::serialize_diagram_to_plantuml;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::errors::EXISTING_DIAGRAM_ERROR_MSG;
use crate::error_handling::errors::INVALID_NEW_PROJECT_PATH_ERROR_CODE;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::clean_diagram_specs;
use crate::helper::diagram_helper::diagram_dist_dir_path_from_name_type;
use crate::helper::diagram_helper::diagram_folder_name_from_type;
use crate::helper::diagram_helper::diagram_human_name_from_dir_name;
use crate::helper::diagram_helper::diagram_name_type_from_path;
use crate::helper::diagram_helper::diagram_spec_path_from_name_type;
use crate::helper::diagram_helper::diagram_type_path;
use crate::helper::diagram_helper::{
  diagram_dir_path_from_name_type, diagram_plantuml_path_from_name_type,
};
use crate::model::diagram::diagram_plantuml::DiagramPlantUML;
use crate::model::diagram::diagram_spec::DiagramSpec;
use crate::model::diagram::Diagram;
use crate::model::diagram::DiagramFormat;
use crate::model::diagram::DiagramType;
use crate::model::project_library::ProjectLibrary;
use crate::repository::library::library_repository;
use crate::resolve_to_write;
use crate::service::diagram_service::validate_diagram;
use data_url::DataUrl;
use std::collections::HashMap;
use std::path::Path;
use strum::IntoEnumIterator;

/**
Returns the list of the diagrams in the opened project.
*/
pub async fn list_diagrams() -> Result<HashMap<DiagramType, Vec<String>>, MinaError> {
  let store = ROOT_RESOLVER.get().read().await;
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .get()
    .await;
  let project_root = project_settings.unwrap().root;

  let mut result = HashMap::new();

  // For each diagram type...
  for diagram_type in DiagramType::iter() {
    // ...retrieve the list of the diagrams...
    let dir_name_diagram_type = diagram_folder_name_from_type(&diagram_type);
    let diagram_type_path = diagram_type_path(&project_root, &dir_name_diagram_type);

    log::debug!("Listing the path {}", &diagram_type_path);
    if let Ok(diagrams_paths) = resolve_to_write!(store, FileSystemAPI)
      .await
      .read_dir(&Path::new(&diagram_type_path))
      .await
    {
      let mut diagrams = vec![];
      for diagram_path in diagrams_paths {
        if diagram_path.is_dir {
          diagrams.push(diagram_human_name_from_dir_name(&diagram_path.file_name));
        }
      }

      //... and store them in the map
      result.insert(diagram_type, diagrams);
    }
  }

  Ok(result)
}

/**
Opens and parses a diagram.
Returns the opened and parsed diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
pub async fn open_diagram(
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<Diagram, MinaError> {
  let plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, &diagram_type).await?;
  let spec_path = diagram_spec_path_from_name_type(diagram_name, &diagram_type).await?;
  log::info!("Opening the diagram {}", plantuml_path);
  let store = ROOT_RESOLVER.get().read().await;
  let diagram_plantuml = resolve_to_write!(store, DiagramPlantUMLFsDAO)
    .await
    .get(Path::new(&plantuml_path))
    .await?;
  let raw_plantuml = serialize_diagram_to_plantuml(&diagram_plantuml);
  let (diagram_name, diagram_type) = diagram_name_type_from_path(&plantuml_path).await?;
  let diagram_spec = resolve_to_write!(store, DiagramSpecFsDAO)
    .await
    .get(Path::new(&spec_path))
    .await?;
  let metadata = resolve_to_write!(store, FileSystemAPI)
    .await
    .metadata(&Path::new(&plantuml_path))
    .await?;
  let last_modified = metadata.last_modified.unwrap().as_secs().to_string();
  // let mut auto_layout = None;
  // if diagram_spec.auto_layout_enabled {
  //   auto_layout = Some(generate_positions(
  //     &diagram_plantuml.elements,
  //     &diagram_spec.auto_layout_orientation,
  //   ));
  // }

  Ok(Diagram {
    diagram_name: Some(diagram_name),
    diagram_type: Some(diagram_type),
    diagram_plantuml: Some(diagram_plantuml),
    diagram_spec: Some(diagram_spec),
    raw_plantuml: Some(raw_plantuml),
    last_modified: Some(last_modified),
    auto_layout: None,
    auto_layout_errors: None,
  })
}

/**
Closes a diagram and and unlocks its files.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
pub async fn close_diagram(
  diagram_name: &str,
  diagram_type: DiagramType,
) -> Result<bool, MinaError> {
  let plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, &diagram_type).await?;
  let spec_path = diagram_spec_path_from_name_type(diagram_name, &diagram_type).await?;
  log::info!("Closing the diagram {}", diagram_name);
  let store = ROOT_RESOLVER.get().read().await;
  let result_plantuml = resolve_to_write!(store, DiagramPlantUMLFsDAO)
    .await
    .unlock_file(Path::new(&plantuml_path), true)?;
  let result_spec = resolve_to_write!(store, DiagramSpecFsDAO)
    .await
    .unlock_file(Path::new(&spec_path), true)?;
  Ok(result_plantuml && result_spec)
}

/**
Deletes a diagram.
Returns updated project's library.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
pub async fn delete_diagram(
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<ProjectLibrary, MinaError> {
  let store = ROOT_RESOLVER.get().read().await;

  // Delete PlantUML file
  let diagram_plantuml_path =
    diagram_plantuml_path_from_name_type(diagram_name, diagram_type).await?;
  resolve_to_write!(store, DiagramPlantUMLFsDAO)
    .await
    .delete(Path::new(&diagram_plantuml_path))
    .await?;

  // Delete Spec file
  let diagram_spec_path = diagram_spec_path_from_name_type(diagram_name, diagram_type).await?;
  resolve_to_write!(store, DiagramSpecFsDAO)
    .await
    .delete(Path::new(&diagram_spec_path))
    .await?;

  // Delete directory of the diagram
  let diagram_path = diagram_dir_path_from_name_type(diagram_name, diagram_type).await?;
  resolve_to_write!(store, FileSystemAPI)
    .await
    .remove_dir_all(&Path::new(&diagram_path))
    .await?;

  // Delete from the library's elements, the references to the deleted element
  Ok(library_repository::delete_diagram_references(diagram_name, diagram_type).await?)
}

/**
Creates a diagram.
# Arguments
  * `new_diagram` - New diagram to create.
*/
pub async fn create_diagram(new_diagram: Diagram) -> Result<(), MinaError> {
  let _diagram_plantuml = new_diagram
    .diagram_plantuml
    .unwrap_or(DiagramPlantUML::default());
  let _diagram_spec = new_diagram.diagram_spec.unwrap_or(DiagramSpec::default());

  let diagram_name = &new_diagram.diagram_name.unwrap();
  let diagram_type = &new_diagram.diagram_type.unwrap();
  let diagram_dir_path = diagram_dir_path_from_name_type(diagram_name, diagram_type).await?;

  let store = ROOT_RESOLVER.get().read().await;

  if resolve_to_write!(store, FileSystemAPI)
    .await
    .path_exists(&Path::new(&diagram_dir_path))
    .await?
  {
    return Err(MinaError::new(
      INVALID_NEW_PROJECT_PATH_ERROR_CODE,
      EXISTING_DIAGRAM_ERROR_MSG,
    ));
  }

  // Create directory of the diagram
  resolve_to_write!(store, FileSystemAPI)
    .await
    .create_dir_all(&Path::new(&diagram_dir_path))
    .await?;

  // Create PlantUML file
  let diagram_plantuml_path =
    diagram_plantuml_path_from_name_type(diagram_name, diagram_type).await?;
  resolve_to_write!(store, DiagramPlantUMLFsDAO)
    .await
    .save(&_diagram_plantuml, Path::new(&diagram_plantuml_path), true)
    .await?;
  // You need to close diagram after saving it, otherwise it remain locked
  resolve_to_write!(store, DiagramPlantUMLFsDAO)
    .await
    .unlock_file(Path::new(&diagram_plantuml_path), true)?;

  // Create Spec file
  let diagram_spec_path = diagram_spec_path_from_name_type(diagram_name, diagram_type).await?;
  resolve_to_write!(store, DiagramSpecFsDAO)
    .await
    .save(&_diagram_spec, Path::new(&diagram_spec_path), true)
    .await?;
  // You need to close diagram after saving it, otherwise it remain locked
  resolve_to_write!(store, DiagramSpecFsDAO)
    .await
    .unlock_file(Path::new(&diagram_spec_path), true)?;

  Ok(())
}

/**
Saves a diagram from its raw PlantUML and cleans the specs (e.g. removes zombies elements).
It also checks the syntax of the raw PlantUML.
Returns the saved diagram.
# Arguments
  * `raw_plantuml` - Raw PlantUML of the diagram.
  * `diagram_spec` - Specifications of the diagram.
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
pub async fn save_spec_diagram_raw_plantuml(
  raw_plantuml: &str,
  diagram_spec: &DiagramSpec,
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<(), MinaError> {
  let plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, diagram_type).await?;
  let spec_path = diagram_spec_path_from_name_type(diagram_name, diagram_type).await?;

  // Validate the diagram before saving it
  log::debug!("Start diagram validation");
  let diagram_plantuml = validate_diagram(raw_plantuml, diagram_name, diagram_type).await?;
  log::debug!("End diagram validation");

  let store = ROOT_RESOLVER.get().read().await;
  resolve_to_write!(store, DiagramPlantUMLFsDAO)
    .await
    .save(&diagram_plantuml, Path::new(&plantuml_path), false)
    .await?;

  let cleaned_diagram_specs = clean_diagram_specs(&diagram_plantuml, diagram_spec);
  resolve_to_write!(store, DiagramSpecFsDAO)
    .await
    .save(&cleaned_diagram_specs, Path::new(&spec_path), false)
    .await?;

  Ok(())
}

/**
Saves a diagram from its parsed representation and cleans the specs (e.g. removes zombies elements).
It also checks the given object is a valid parsed PlantUML representation.
Returns the saved diagram.
# Arguments
  * `diagram_plantuml` - Parsed PlantUML representation of the diagram.
  * `diagram_spec` - Specifications of the diagram.
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
// pub fn save_spec_diagram_parsed_plantuml(
//   diagram_plantuml: &DiagramPlantUML,
//   diagram_spec: &DiagramSpec,
//   diagram_name: &str,
//   diagram_type: &DiagramType,
// ) -> Result<(), MinaError> {
//   let plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, diagram_type)?;
//   let spec_path = diagram_spec_path_from_name_type(diagram_name, diagram_type)?;

//   // serialize and deserialize again to check the given object is a valid PlantUML representation.
//   deserialize_plantuml_by_string(&diagram_plantuml.serialize_to_plantuml())?;

//   let store = ROOT_RESOLVER.get().read().await;
//   resolve_to_write!(store, DiagramPlantUMLFsDAO).save(
//     diagram_plantuml,
//     Path::new(&plantuml_path),
//     false,
//   )?;

//   let cleaned_diagram_specs = clean_diagram_specs(&diagram_plantuml, diagram_spec);
//   resolve_to_write!(store, DiagramSpecFsDAO).save(
//     &cleaned_diagram_specs,
//     Path::new(&spec_path),
//     false,
//   )?;

//   Ok(())
// }

/**
Exports a diagram whose content is represented by the given data url,
to a file in the given format.
Returns the path where the diagram has been exported.
# Arguments
  * `diagram_data_url` - Data URL of the diagram to export.
  * `format` - Format of the diagram to export.
  * `diagram_name` - Name of the diagram to export.
  * `diagram_type` - Type of the diagram to export.
*/
pub async fn export_diagram_to_file(
  diagram_data_url: &str,
  format: &DiagramFormat,
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  let url = DataUrl::process(diagram_data_url).unwrap();
  let (body, _fragment) = url.decode_to_vec().unwrap();
  let dist_diagram_path = format!(
    "{}{}{}",
    diagram_dist_dir_path_from_name_type(diagram_name, diagram_type).await?,
    ".",
    format
  );

  log::info!(
    "Exporting diagram {} to {}",
    diagram_name,
    dist_diagram_path
  );

  let store = ROOT_RESOLVER.get().read().await;
  let path_exported_diagram = Path::new(&dist_diagram_path);
  resolve_to_write!(store, BinaryFsDAO)
    .await
    .save(&body, path_exported_diagram, true)
    .await?;
  Ok(String::from(path_exported_diagram.to_str().unwrap()))
}
