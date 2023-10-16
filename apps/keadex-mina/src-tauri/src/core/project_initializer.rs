/*!
Project Initializer.
Module which exposes the function to initialize a project.
*/

use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::{
  ComponentFsDAO, ContainerFsDAO, DiagramPlantUMLFsDAO, PersonFsDAO, ProjectLibraryIMDAO,
  ProjectSettingsFsDAO, ProjectSettingsIMDAO, SoftwareSystemFsDAO,
};
use crate::dao::filesystem::diagram::diagram_plantuml_dao::FILE_NAME as DIAGRAM_PLANTUML_FILE_NAME;
use crate::dao::filesystem::diagram::diagram_spec_dao::FILE_NAME as DIAGRAM_SPEC_FILE_NAME;
use crate::dao::filesystem::library::component_dao::FILE_NAME as COMPONENTS_FILE_NAME;
use crate::dao::filesystem::library::container_dao::FILE_NAME as CONTAINERS_FILE_NAME;
use crate::dao::filesystem::library::person_dao::FILE_NAME as PERSONS_FILE_NAME;
use crate::dao::filesystem::library::software_system_dao::FILE_NAME as SOFTWARE_SYSTEMS_FILE_NAME;
use crate::dao::filesystem::library::LIBRARY_FILE_NAMES;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::{diagram_folder_name_from_type, diagram_type_path};
use crate::helper::library_helper::{project_library_file_path, project_library_path};
use crate::helper::project_helper::project_settings_path;
use crate::model::c4_element::C4Elements;
use crate::model::diagram::DiagramType;
use crate::model::project::Project;
use crate::model::project_library::ProjectLibrary;
use crate::model::project_settings::ProjectSettings;
use crate::resolve_to_write;
use crate::templates::demo_diagram_puml::generate_demo_diagram_puml;
use crate::templates::demo_diagram_spec::generate_demo_diagram_spec;
use crate::validator::project_validator::{
  validate_output_project_directory, validate_project_structure,
};
use std::fs::File;
use std::io::Write;
use std::path::{Path, MAIN_SEPARATOR};
use strum::IntoEnumIterator;

/**
Loads a project
# Arguments
  * `root` - root of the Mina project
*/
pub fn load_project(root: &str) -> Result<Project, MinaError> {
  log::debug!("Load project {}", root);
  validate_project_structure(root)?;
  let project_settings = load_project_settings(root)?;
  let project_library = load_project_library(root)?;
  Ok(Project {
    project_settings,
    project_library,
  })
}

/**
Loads settings of a project
# Arguments
  * `path` - Path of the Mina project
*/
fn load_project_settings(root: &str) -> Result<ProjectSettings, MinaError> {
  let full_path = project_settings_path(root);
  log::debug!("Load Project Settings {}", full_path);
  let store = ROOT_RESOLVER.get().read().unwrap();
  let mut settings = resolve_to_write!(store, ProjectSettingsFsDAO).get(Path::new(&full_path))?;
  settings.root = root.to_string();
  let saved_settings = Some(settings);
  resolve_to_write!(store, ProjectSettingsIMDAO).save(&saved_settings);
  Ok(saved_settings.unwrap())
}

/**
Loads library of a project
# Arguments
  * `path` - Path of the Mina project
*/
fn load_project_library(root: &str) -> Result<ProjectLibrary, MinaError> {
  let base_library_path = project_library_path(root);
  log::debug!("Load Project Library {}", base_library_path);

  let store = ROOT_RESOLVER.get().read().unwrap();

  let components = resolve_to_write!(store, ComponentFsDAO).get_all(Path::new(
    &project_library_file_path(root, COMPONENTS_FILE_NAME),
  ))?;
  let containers = resolve_to_write!(store, ContainerFsDAO).get_all(Path::new(
    &project_library_file_path(root, CONTAINERS_FILE_NAME),
  ))?;
  let persons = resolve_to_write!(store, PersonFsDAO).get_all(Path::new(
    &project_library_file_path(root, PERSONS_FILE_NAME),
  ))?;
  let software_systems = resolve_to_write!(store, SoftwareSystemFsDAO).get_all(Path::new(
    &project_library_file_path(root, SOFTWARE_SYSTEMS_FILE_NAME),
  ))?;

  let project_library = Some(ProjectLibrary {
    elements: C4Elements {
      boundaries: vec![],
      components,
      containers,
      deployment_nodes: vec![],
      persons,
      software_systems,
      relationships: vec![],
    },
  });
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&project_library);
  Ok(project_library.unwrap())
}

/**
Unloads a project and cleans state of the app
# Arguments
  * `root` - root of the Mina project
*/
pub fn unload_project(root: &str) -> Result<(), MinaError> {
  log::debug!("Unload project {}", root);

  let store = ROOT_RESOLVER.get().read().unwrap();

  // unlock/clean project settings
  resolve_to_write!(store, ProjectSettingsFsDAO).unlock_all_files(true)?;
  resolve_to_write!(store, ProjectSettingsIMDAO).save(&None);

  // unlock/clean project library
  resolve_to_write!(store, ComponentFsDAO).unlock_all_files(true)?;
  resolve_to_write!(store, ContainerFsDAO).unlock_all_files(true)?;
  resolve_to_write!(store, PersonFsDAO).unlock_all_files(true)?;
  resolve_to_write!(store, SoftwareSystemFsDAO).unlock_all_files(true)?;
  resolve_to_write!(store, ProjectLibraryIMDAO).save(&None);

  // unlock diagrams
  resolve_to_write!(store, DiagramPlantUMLFsDAO).unlock_all_files(true)?;

  Ok(())
}

/**
Unloads a project and cleans state of the app
# Arguments
  * `root` - root of the Mina project
*/
pub fn create_empty_project(
  project_settings: ProjectSettings,
) -> Result<ProjectSettings, MinaError> {
  log::info!("Create empty project {:?}", project_settings);

  let store = ROOT_RESOLVER.get().read().unwrap();

  // Validate the output path of the new project
  validate_output_project_directory(&project_settings.root)?;

  // Create diagrams folder, a folder for each diagram type and a file .gitkeep
  // to let git to keep it
  for diagram_type in DiagramType::iter() {
    let diagram_type_path = diagram_type_path(
      &project_settings.root,
      &diagram_folder_name_from_type(&diagram_type),
    );
    std::fs::create_dir_all(&diagram_type_path)?;
    File::create(format!(
      "{}{}{}",
      &diagram_type_path, MAIN_SEPARATOR, ".gitkeep"
    ))?;
  }

  // Create demo diagram
  let demo_diagram_name = "demo-diagram";
  let demo_diagram_type = DiagramType::SystemContext;
  let demo_diagram_path = format!(
    "{}{}{}",
    diagram_type_path(
      &project_settings.root,
      &diagram_folder_name_from_type(&demo_diagram_type),
    ),
    MAIN_SEPARATOR,
    demo_diagram_name
  );
  std::fs::create_dir_all(&demo_diagram_path)?;
  let mut demo_plantuml_file = File::create(format!(
    "{}{}{}",
    demo_diagram_path, MAIN_SEPARATOR, DIAGRAM_PLANTUML_FILE_NAME
  ))?;
  demo_plantuml_file.write_all(generate_demo_diagram_puml().as_bytes())?;
  let mut demo_spec_file = File::create(format!(
    "{}{}{}",
    demo_diagram_path, MAIN_SEPARATOR, DIAGRAM_SPEC_FILE_NAME
  ))?;
  demo_spec_file.write_all(generate_demo_diagram_spec().as_bytes())?;

  // Create library folder and the library's files (each of which contains an empty array)
  let library_path = project_library_path(&project_settings.root);
  std::fs::create_dir_all(&library_path)?;
  for library_file_name in LIBRARY_FILE_NAMES {
    let mut file = File::create(project_library_file_path(
      &project_settings.root,
      &library_file_name,
    ))?;
    // Each library file contains initially an empty array
    file.write_all(b"[]")?;
  }

  // Generate README file
  let mut readme_file = File::create(format!(
    "{}{}{}",
    &project_settings.root, MAIN_SEPARATOR, "README.md"
  ))?;
  readme_file.write_all(b"# My new Mina project\n\nThis is my new auto-generated Mina project.")?;

  // Generate .gitignore file
  let mut git_ignore = File::create(format!(
    "{}{}{}",
    &project_settings.root, MAIN_SEPARATOR, ".gitignore"
  ))?;
  git_ignore.write_all(b"*.log\ndist")?;

  // Generate project settings file
  resolve_to_write!(store, ProjectSettingsFsDAO).save(
    &project_settings,
    &Path::new(&project_settings_path(&project_settings.root)),
    true,
  )?;

  Ok(project_settings)
}
