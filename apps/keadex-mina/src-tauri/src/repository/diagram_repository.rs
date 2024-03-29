/*!
Diagram Repository.
Module which exposes functions to access/alter Diagrams data.
Under the hood it uses DAOs.
*/

use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::BinaryFsDAO;
use crate::core::resolver::ResolvableModules::DiagramPlantUMLFsDAO;
use crate::core::resolver::ResolvableModules::DiagramSpecFsDAO;
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::core::serializer::deserialize_plantuml_by_string;
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
use crate::model::diagram::diagram_plantuml::PlantUMLSerializer;
use crate::model::diagram::diagram_spec::DiagramSpec;
use crate::model::diagram::Diagram;
use crate::model::diagram::DiagramFormat;
use crate::model::diagram::DiagramType;
use crate::model::project_library::ProjectLibrary;
use crate::repository::library::library_repository;
use crate::resolve_to_write;
use data_url::DataUrl;
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use strum::IntoEnumIterator;

/**
Returns the list of the diagrams in the opened project.
*/
pub fn list_diagrams() -> Result<HashMap<DiagramType, Vec<String>>, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO).get();
  let project_root = project_settings.unwrap().root;

  let mut result = HashMap::new();

  // For each diagram type...
  for diagram_type in DiagramType::iter() {
    // ...retrieve the list of the diagrams...
    let dir_name_diagram_type = diagram_folder_name_from_type(&diagram_type);
    let diagram_type_path = diagram_type_path(&project_root, &dir_name_diagram_type);

    log::debug!("Listing the path {}", &diagram_type_path);
    if let Ok(diagrams_paths) = fs::read_dir(diagram_type_path) {
      let mut diagrams = vec![];
      for diagram_path in diagrams_paths {
        let path = diagram_path.unwrap().path();
        if path.is_dir() {
          diagrams.push(diagram_human_name_from_dir_name(
            &path.file_name().unwrap().to_str().unwrap(),
          ));
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
pub fn open_diagram(diagram_name: &str, diagram_type: DiagramType) -> Result<Diagram, MinaError> {
  let plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, &diagram_type)?;
  let spec_path = diagram_spec_path_from_name_type(diagram_name, &diagram_type)?;
  log::info!("Opening the diagram {}", plantuml_path);
  let store = ROOT_RESOLVER.get().read().unwrap();
  let diagram_plantuml =
    resolve_to_write!(store, DiagramPlantUMLFsDAO).get(Path::new(&plantuml_path))?;
  let raw_plantuml = serialize_diagram_to_plantuml(&diagram_plantuml);
  let (diagram_name, diagram_type) = diagram_name_type_from_path(&plantuml_path)?;
  let diagram_spec = resolve_to_write!(store, DiagramSpecFsDAO).get(Path::new(&spec_path))?;
  Ok(Diagram {
    diagram_name: Some(diagram_name),
    diagram_type: Some(diagram_type),
    diagram_plantuml: Some(diagram_plantuml),
    diagram_spec: Some(diagram_spec),
    raw_plantuml: Some(raw_plantuml),
  })
}

/**
Closes a diagram and and unlocks its files.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
pub fn close_diagram(diagram_name: &str, diagram_type: DiagramType) -> Result<bool, MinaError> {
  let plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, &diagram_type)?;
  let spec_path = diagram_spec_path_from_name_type(diagram_name, &diagram_type)?;
  log::info!("Closing the diagram {}", diagram_name);
  let store = ROOT_RESOLVER.get().read().unwrap();
  let result_plantuml =
    resolve_to_write!(store, DiagramPlantUMLFsDAO).unlock_file(Path::new(&plantuml_path), true)?;
  let result_spec =
    resolve_to_write!(store, DiagramSpecFsDAO).unlock_file(Path::new(&spec_path), true)?;
  Ok(result_plantuml && result_spec)
}

/**
Deletes a diagram.
Returns updated project's library.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
*/
pub fn delete_diagram(
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<ProjectLibrary, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();

  // Delete PlantUML file
  let diagram_plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, diagram_type)?;
  resolve_to_write!(store, DiagramPlantUMLFsDAO).delete(Path::new(&diagram_plantuml_path))?;

  // Delete Spec file
  let diagram_spec_path = diagram_spec_path_from_name_type(diagram_name, diagram_type)?;
  resolve_to_write!(store, DiagramSpecFsDAO).delete(Path::new(&diagram_spec_path))?;

  // Delete directory of the diagram
  let diagram_path = diagram_dir_path_from_name_type(diagram_name, diagram_type)?;
  std::fs::remove_dir_all(&diagram_path)?;

  // Delete from the library's elements, the references to the deleted element
  Ok(library_repository::delete_diagram_references(
    diagram_name,
    diagram_type,
  )?)
}

/**
Duplicates a diagram.
# Arguments
  * `from_diagram_name` - Name of the diagram to duplicate.
  * `from_diagram_type` - Type of the diagram to duplicate.
  * `to_diagram_name` - Name of the duplicated diagram.
  * `to_diagram_type` - Type of the duplicated diagram.
*/
pub fn duplicate_diagram(
  from_diagram_name: &str,
  from_diagram_type: &DiagramType,
  to_diagram_name: &str,
  to_diagram_type: &DiagramType,
) -> Result<bool, MinaError> {
  let from_diagram = open_diagram(from_diagram_name, from_diagram_type.clone())?;
  close_diagram(from_diagram_name, from_diagram_type.clone())?;
  create_diagram(
    to_diagram_name,
    &to_diagram_type,
    from_diagram.diagram_plantuml,
    from_diagram.diagram_spec,
  )?;
  Ok(true)
}

/**
Creates a diagram.
# Arguments
  * `diagram_name` - Name of the diagram to open.
  * `diagram_type` - Type of the diagram to open.
  * `diagram_plantuml` - Optional PlantUML code of the new diagram.
  * `diagram_spec` - Optional specifications of the new diagram.
*/
pub fn create_diagram(
  diagram_name: &str,
  diagram_type: &DiagramType,
  diagram_plantuml: Option<DiagramPlantUML>,
  diagram_spec: Option<DiagramSpec>,
) -> Result<(), MinaError> {
  let _diagram_plantuml = diagram_plantuml.unwrap_or(DiagramPlantUML::default());
  let _diagram_spec = diagram_spec.unwrap_or(DiagramSpec::default());
  let store = ROOT_RESOLVER.get().read().unwrap();
  let diagram_dir_path = diagram_dir_path_from_name_type(diagram_name, &diagram_type)?;

  if Path::new(&diagram_dir_path).exists() {
    return Err(MinaError::new(
      INVALID_NEW_PROJECT_PATH_ERROR_CODE,
      EXISTING_DIAGRAM_ERROR_MSG,
    ));
  }

  // Create directory of the diagram
  std::fs::create_dir_all(&diagram_dir_path)?;

  // Create PlantUML file
  let diagram_plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, diagram_type)?;
  resolve_to_write!(store, DiagramPlantUMLFsDAO).save(
    &_diagram_plantuml,
    Path::new(&diagram_plantuml_path),
    true,
  )?;
  // You need to close diagram after saving it, otherwise it remain locked
  resolve_to_write!(store, DiagramPlantUMLFsDAO)
    .unlock_file(Path::new(&diagram_plantuml_path), true)?;

  // Create Spec file
  let diagram_spec_path = diagram_spec_path_from_name_type(diagram_name, diagram_type)?;
  resolve_to_write!(store, DiagramSpecFsDAO).save(
    &_diagram_spec,
    Path::new(&diagram_spec_path),
    true,
  )?;
  // You need to close diagram after saving it, otherwise it remain locked
  resolve_to_write!(store, DiagramSpecFsDAO).unlock_file(Path::new(&diagram_spec_path), true)?;

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
pub fn save_spec_diagram_raw_plantuml(
  raw_plantuml: &str,
  diagram_spec: &DiagramSpec,
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<(), MinaError> {
  let plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, diagram_type)?;
  let spec_path = diagram_spec_path_from_name_type(diagram_name, diagram_type)?;

  // deserialize to check the given raw PlantUML is valid
  let diagram_plantuml = deserialize_plantuml_by_string(&raw_plantuml.to_string())?;

  let store = ROOT_RESOLVER.get().read().unwrap();
  resolve_to_write!(store, DiagramPlantUMLFsDAO).save(
    &diagram_plantuml,
    Path::new(&plantuml_path),
    false,
  )?;

  let cleaned_diagram_specs = clean_diagram_specs(&diagram_plantuml, diagram_spec);
  resolve_to_write!(store, DiagramSpecFsDAO).save(
    &cleaned_diagram_specs,
    Path::new(&spec_path),
    false,
  )?;

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
pub fn save_spec_diagram_parsed_plantuml(
  diagram_plantuml: &DiagramPlantUML,
  diagram_spec: &DiagramSpec,
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<(), MinaError> {
  let plantuml_path = diagram_plantuml_path_from_name_type(diagram_name, diagram_type)?;
  let spec_path = diagram_spec_path_from_name_type(diagram_name, diagram_type)?;

  // serialize and deserialize again to check the given object is a valid PlantUML representation.
  deserialize_plantuml_by_string(&diagram_plantuml.serialize_to_plantuml())?;

  let store = ROOT_RESOLVER.get().read().unwrap();
  resolve_to_write!(store, DiagramPlantUMLFsDAO).save(
    diagram_plantuml,
    Path::new(&plantuml_path),
    false,
  )?;

  let cleaned_diagram_specs = clean_diagram_specs(&diagram_plantuml, diagram_spec);
  resolve_to_write!(store, DiagramSpecFsDAO).save(
    &cleaned_diagram_specs,
    Path::new(&spec_path),
    false,
  )?;

  Ok(())
}

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
pub fn export_diagram_to_file(
  diagram_data_url: &str,
  format: &DiagramFormat,
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  let url = DataUrl::process(diagram_data_url).unwrap();
  let (body, fragment) = url.decode_to_vec().unwrap();
  let dist_diagram_path = format!(
    "{}{}{}",
    diagram_dist_dir_path_from_name_type(diagram_name, diagram_type)?,
    ".",
    format
  );

  log::info!(
    "Exporting diagram {} to {}",
    diagram_name,
    dist_diagram_path
  );

  let store = ROOT_RESOLVER.get().read().unwrap();
  let path_exported_diagram = Path::new(&dist_diagram_path);
  resolve_to_write!(store, BinaryFsDAO).save(&body, path_exported_diagram, true)?;
  Ok(String::from(path_exported_diagram.to_str().unwrap()))
}
