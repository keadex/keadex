use crate::model::commands::diagram_element::DiagramElement;
use clap::{Parser, Subcommand};
use mina_mcp_server::models::requests::create_diagram_request::CreateDiagramRequest;
use mina_mcp_server::models::requests::edit_plantuml_request::EditPlantUmlRequest;
use mina_mcp_server::models::requests::find_diagram_element_request::FindDiagramElementRequest;
use mina_mcp_server::models::requests::local_diagram_base_request::LocalDiagramBaseRequest;
use mina_mcp_server::models::requests::read_remote_diagram_request::ReadRemoteDiagramRequest;
use mina_mcp_server::models::requests::validate_plantuml_code_request::ValidatePlantUmlCodeRequest;
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
  pub project_path: Option<PathBuf>,

  #[command(subcommand)]
  pub cmd: Commands,

  #[arg(long, hide = true)]
  pub markdown_help: bool,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
  /// Create a container in the project's library.
  CreateContainer(CreateContainerRequest),

  /// Create a component in the project's library.
  CreateComponent(CreateComponentRequest),

  /// Create a person in the project's library.
  CreatePerson(CreatePersonRequest),

  /// Create a software system in the project's library.
  CreateSystem(CreateSystemRequest),

  /// Create a new diagram in the project.
  ///
  /// This command will create a new diagram in the project. On success, returns a confirmation of the diagram creation.
  CreateDiagram(CreateDiagramRequest),

  /// Create a new Mina project in the given path.

  /// This command will create a new Mina project in the given path with the given name, description and version.
  /// Returns the configuration of the newly created project including the path of its folder.
  CreateProject(CreateProjectRequest),

  /// Delete a diagram in the project.
  ///
  /// This command will delete a diagram in the project. On success, returns the updated project library configuration reflecting the deletion of the diagram.
  DeleteDiagram(LocalDiagramBaseRequest),

  /// Edit the PlantUML code of a diagram in the project.
  ///
  /// This command will edit the PlantUML code of a diagram in the project. On success, returns the updated diagram.
  EditDiagramPlantumlCode(EditPlantUmlRequest),

  /// Returns the dependents of a an architectural element with the given alias in the given diagram.
  FindDependentElements(FindDiagramElementRequest),

  /// Returns the diagrams in the project. The returned object is a map where the keys represent the diagrams' types, and the values represent the diagrams' names.
  ListDiagrams,

  /// Returns the elements in the project's library. The returned object is a map where the keys represent the elements' types, and the values represent the elements in the library.
  ListLibraryElements,

  /// Read a diagram
  ReadDiagram(LocalDiagramBaseRequest),

  /// Read a diagram from a remote Keadex Mina project hosted in a GitHub repository.
  ///
  /// This command will read a diagram from a remote Keadex Mina project hosted in a GitHub repository. On success, returns the read diagram.
  ReadRemoteDiagram(ReadRemoteDiagramRequest),

  /// Read all the diagrams in the project.
  ///
  /// This command read all the diagrams in the project.
  /// The returned object contains a vector of objects where each object represents a diagram.
  ReadAllDiagrams,

  /// Search for the given string in the project's files and replace the found occurrences with the given replacement string.
  SearchAndReplace(SearchAndReplaceRequest),

  /// Search for the project's diagrams that include the element with the given alias.
  SearchDiagramElement(DiagramElement),

  /// Search in the project's library for an element with the given alias.
  SearchLibraryElement(DiagramElement),

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

  /// Validate a diagram in the project.
  ///
  /// This command will return an object containing the validation result of the diagram.
  ValidateDiagram(LocalDiagramBaseRequest),

  /// Validate the PlantUML code of a diagram.
  ///
  /// This command will return an object containing the validation result of the PlantUML code of the diagram.
  ValidatePlantumlCode(ValidatePlantUmlCodeRequest),

  /// Validate the project in the given path. This command will return an error if the project is not valid.
  ValidateProject,
}
