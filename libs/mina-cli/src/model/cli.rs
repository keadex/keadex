use crate::model::commands::find_dependent_elements::FindDependentElements;
use crate::model::commands::read_diagram::ReadDiagram;
use crate::model::commands::search_diagram_element::SearchDiagramElement;
use crate::model::commands::search_library_element::SearchLibraryElement;
use clap::{Parser, Subcommand};
use mina_mcp_server::models::requests::{
  create_component_request::CreateComponentRequest,
  create_container_request::CreateContainerRequest, create_person_request::CreatePersonRequest,
  create_project_request::CreateProjectRequest, create_system_request::CreateSystemRequest,
  search_and_replace_request::SearchAndReplaceRequest,
  update_component_request::UpdateComponentRequest,
  update_container_request::UpdateContainerRequest, update_person_request::UpdatePersonRequest,
  update_system_request::UpdateSystemRequest,
};
use std::path::PathBuf;

/// A CLI for interacting with a Keadex Mina project.
///
/// Visit https://keadex.dev/en/docs/mina/features/cli for more!
#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub struct Cli {
  /// Path of the Mina project
  #[arg(short, long)]
  pub project_path: PathBuf,

  #[command(subcommand)]
  pub cmd: Commands,

  #[arg(long, hide = true)]
  pub markdown_help: bool,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
  /// Create a new Mina project in the given path.

  /// This command will create a new Mina project in the given path with the given name, description and version.
  /// Returns the configuration of the newly created project including the path of its folder.
  CreateProject(CreateProjectRequest),

  /// Returns the dependents of a an architectural element with the given alias in the given diagram.
  FindDependentElements(FindDependentElements),

  /// Returns the diagrams in the project. The returned object is a map where the keys represent the diagrams' types, and the values represent the diagrams' names.
  ListDiagrams,

  /// Returns the elements in the project's library. The returned object is a map where the keys represent the elements' types, and the values represent the elements in the library.
  ListLibraryElements,

  /// Read a diagram
  ReadDiagram(ReadDiagram),

  /// Read all the diagrams in the project.
  ///
  /// This command read all the diagrams in the project.
  /// The returned object contains a vector of objects where each object represents a diagram.
  ReadAllDiagrams,

  /// Search for the given string in the project's files and replace the found occurrences with the given replacement string.
  SearchAndReplace(SearchAndReplaceRequest),

  /// Search for the project's diagrams that include the element with the given alias.
  SearchDiagramElement(SearchDiagramElement),

  /// Search in the project's library for an element with the given alias.
  SearchLibraryElement(SearchLibraryElement),

  /// Create a person in the project's library.
  CreatePerson(CreatePersonRequest),

  /// Create a software system in the project's library.
  CreateSystem(CreateSystemRequest),

  /// Create a container in the project's library.
  CreateContainer(CreateContainerRequest),

  /// Create a component in the project's library.
  CreateComponent(CreateComponentRequest),

  /// Update a person in the project's library.
  ///
  /// This command will update a person in the project's library
  /// and will update all the diagrams that import it.
  UpdatePerson(UpdatePersonRequest),

  /// Update a software system in the project's library.
  ///
  /// This command will update a software system in the project's library
  /// and will update all the diagrams that import it.
  UpdateSystem(UpdateSystemRequest),

  /// Update a container in the project's library.
  ///
  /// This command will update a container in the project's library
  /// and will update all the diagrams that import it.
  UpdateContainer(UpdateContainerRequest),

  /// Update a component in the project's library.
  ///
  /// This command will update a component in the project's library
  /// and will update all the diagrams that import it.
  UpdateComponent(UpdateComponentRequest),

  /// Create or update a person (and the dependent diagrams) in the project's library.
  UpsertPerson(UpdatePersonRequest),

  /// Create or update a software system (and the dependent diagrams) in the project's library.
  UpsertSystem(UpdateSystemRequest),

  /// Create or update a container (and the dependent diagrams) in the project's library.
  UpsertContainer(UpdateContainerRequest),

  /// Create or update a component (and the dependent diagrams) in the project's library.
  UpsertComponent(UpdateComponentRequest),
}
