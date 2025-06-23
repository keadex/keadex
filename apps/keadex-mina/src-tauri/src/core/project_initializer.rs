/*!
Project Initializer.
Module which exposes the function to initialize a project.
*/

use crate::api::filesystem::FileSystemAPI as FsApiTrait;
use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::{
  ComponentFsDAO, ContainerFsDAO, DiagramPlantUMLFsDAO, FileSystemAPI, PersonFsDAO,
  ProjectLibraryIMDAO, ProjectSettingsFsDAO, ProjectSettingsIMDAO, SoftwareSystemFsDAO,
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
use crate::helper::hook_helper::hooks_path;
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
use crate::templates::hooks_js_file::generate_hooks_js_file;
use crate::templates::readme_file::generate_readme_file;
use crate::validator::project_validator::{
  validate_output_project_directory, validate_project_structure,
};
use convert_case::{Case, Casing};
use std::path::{Path, MAIN_SEPARATOR};
use strum::IntoEnumIterator;

/**
Loads a project
# Arguments
  * `root` - root of the Mina project
*/
pub async fn load_project(root: &str) -> Result<Project, MinaError> {
  log::debug!("Load project {}", root);
  validate_project_structure(root).await?;
  let project_settings = load_project_settings(root).await?;
  let project_library = load_project_library(root).await?;
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
async fn load_project_settings(root: &str) -> Result<ProjectSettings, MinaError> {
  let full_path = project_settings_path(root);
  log::debug!("Load Project Settings {}", full_path);
  let store = ROOT_RESOLVER.get().read().await;
  let mut settings = resolve_to_write!(store, ProjectSettingsFsDAO)
    .await
    .get(Path::new(&full_path))
    .await?;
  settings.root = root.to_string();
  let saved_settings = Some(settings);
  resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .save(&saved_settings)
    .await;
  Ok(saved_settings.unwrap())
}

/**
Loads library of a project
# Arguments
  * `path` - Path of the Mina project
*/
async fn load_project_library(root: &str) -> Result<ProjectLibrary, MinaError> {
  let base_library_path = project_library_path(root);
  log::debug!("Load Project Library {}", base_library_path);

  let store = ROOT_RESOLVER.get().read().await;

  let components = resolve_to_write!(store, ComponentFsDAO)
    .await
    .get_all(Path::new(&project_library_file_path(
      root,
      COMPONENTS_FILE_NAME,
    )))
    .await?;
  let containers = resolve_to_write!(store, ContainerFsDAO)
    .await
    .get_all(Path::new(&project_library_file_path(
      root,
      CONTAINERS_FILE_NAME,
    )))
    .await?;
  let persons = resolve_to_write!(store, PersonFsDAO)
    .await
    .get_all(Path::new(&project_library_file_path(
      root,
      PERSONS_FILE_NAME,
    )))
    .await?;
  let software_systems = resolve_to_write!(store, SoftwareSystemFsDAO)
    .await
    .get_all(Path::new(&project_library_file_path(
      root,
      SOFTWARE_SYSTEMS_FILE_NAME,
    )))
    .await?;

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
  resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .save(&project_library)
    .await;
  Ok(project_library.unwrap())
}

/**
Unloads a project and cleans state of the app
# Arguments
  * `root` - root of the Mina project
*/
pub async fn unload_project(root: &str) -> Result<(), MinaError> {
  log::debug!("Unload project {}", root);

  let store = ROOT_RESOLVER.get().read().await;

  // unlock/clean project settings
  resolve_to_write!(store, ProjectSettingsFsDAO)
    .await
    .unlock_all_files(true)?;
  resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .save(&None)
    .await;

  // unlock/clean project library
  resolve_to_write!(store, ComponentFsDAO)
    .await
    .unlock_all_files(true)?;
  resolve_to_write!(store, ContainerFsDAO)
    .await
    .unlock_all_files(true)?;
  resolve_to_write!(store, PersonFsDAO)
    .await
    .unlock_all_files(true)?;
  resolve_to_write!(store, SoftwareSystemFsDAO)
    .await
    .unlock_all_files(true)?;
  resolve_to_write!(store, ProjectLibraryIMDAO)
    .await
    .save(&None)
    .await;

  // unlock diagrams
  resolve_to_write!(store, DiagramPlantUMLFsDAO)
    .await
    .unlock_all_files(true)?;

  Ok(())
}

/**
Unloads a project and cleans state of the app
# Arguments
  * `root` - root of the Mina project
*/
pub async fn create_empty_project(
  mut project_settings: ProjectSettings,
) -> Result<ProjectSettings, MinaError> {
  log::info!("Create empty project {:?}", project_settings);

  let store = ROOT_RESOLVER.get().read().await;

  // Validate the output path of the new project
  let project_folder = &project_settings.name.to_case(Case::Kebab);
  let full_project_root =
    validate_output_project_directory(&project_settings.root, &project_folder).await?;
  project_settings.root = full_project_root;

  // Create diagrams folder, a folder for each diagram type and a file .gitkeep
  // to let git to keep it
  for diagram_type in DiagramType::iter() {
    let diagram_type_path = diagram_type_path(
      &project_settings.root,
      &diagram_folder_name_from_type(&diagram_type),
    );
    resolve_to_write!(store, FileSystemAPI)
      .await
      .create_dir_all(&Path::new(&diagram_type_path))
      .await?;
    resolve_to_write!(store, FileSystemAPI)
      .await
      .create(&Path::new(&format!(
        "{}{}{}",
        &diagram_type_path, MAIN_SEPARATOR, ".gitkeep"
      )))
      .await?;
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
  resolve_to_write!(store, FileSystemAPI)
    .await
    .create_dir_all(&Path::new(&demo_diagram_path))
    .await?;

  // --- PlantUML File
  let mut demo_plantuml_file = resolve_to_write!(store, FileSystemAPI)
    .await
    .create(&Path::new(&format!(
      "{}{}{}",
      demo_diagram_path, MAIN_SEPARATOR, DIAGRAM_PLANTUML_FILE_NAME
    )))
    .await?;
  demo_plantuml_file
    .write_all(generate_demo_diagram_puml().as_bytes())
    .await?;

  // --- Spec File
  let mut demo_spec_file = resolve_to_write!(store, FileSystemAPI)
    .await
    .create(&Path::new(&format!(
      "{}{}{}",
      demo_diagram_path, MAIN_SEPARATOR, DIAGRAM_SPEC_FILE_NAME
    )))
    .await?;
  demo_spec_file
    .write_all(generate_demo_diagram_spec().as_bytes())
    .await?;

  // Create library folder and the library's files (each of which contains an empty array)
  let library_path = project_library_path(&project_settings.root);
  resolve_to_write!(store, FileSystemAPI)
    .await
    .create_dir_all(&Path::new(&library_path))
    .await?;
  for library_file_name in LIBRARY_FILE_NAMES {
    let mut file = resolve_to_write!(store, FileSystemAPI)
      .await
      .create(&Path::new(&project_library_file_path(
        &project_settings.root,
        &library_file_name,
      )))
      .await?;

    // Each library file contains initially an empty array
    file.write_all(b"[]").await?;
  }

  // Generate README file
  let mut readme_file = resolve_to_write!(store, FileSystemAPI)
    .await
    .create(&Path::new(&format!(
      "{}{}{}",
      &project_settings.root, MAIN_SEPARATOR, "README.md"
    )))
    .await?;
  readme_file
    .write_all(generate_readme_file().as_bytes())
    .await?;

  // Generate .gitignore file
  let mut git_ignore = resolve_to_write!(store, FileSystemAPI)
    .await
    .create(&Path::new(&format!(
      "{}{}{}",
      &project_settings.root, MAIN_SEPARATOR, ".gitignore"
    )))
    .await?;
  git_ignore.write_all(b"*.log\ndist").await?;

  // Generate project settings file
  // Before saving the project settings in fs, replace the real root with a static placehodler.
  // The root must not be saved in the file system, because it is relative
  // to the user's machine and it cannot be versioned.
  let project_settings_no_root = ProjectSettings {
    root: String::from("<autogenerated>"),
    ..project_settings.clone()
  };
  resolve_to_write!(store, ProjectSettingsFsDAO)
    .await
    .save(
      &project_settings_no_root,
      &Path::new(&project_settings_path(&project_settings.root)),
      true,
    )
    .await?;

  // Generate hooks js file
  let mut hooks_file = resolve_to_write!(store, FileSystemAPI)
    .await
    .create(&Path::new(&hooks_path(&project_settings.root)))
    .await?;
  hooks_file
    .write_all(generate_hooks_js_file().as_bytes())
    .await?;

  Ok(project_settings)
}
