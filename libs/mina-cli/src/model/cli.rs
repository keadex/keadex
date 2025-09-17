use crate::model::commands::create_component::CreateComponent;
use crate::model::commands::create_container::CreateContainer;
use crate::model::commands::create_person::CreatePerson;
use crate::model::commands::create_system::CreateSystem;
use crate::model::commands::find_dependent_elements::FindDependentElements;
use crate::model::commands::read_diagram::ReadDiagram;
use crate::model::commands::search_and_replace::SearchAndReplace;
use crate::model::commands::search_diagram_element::SearchDiagramElement;
use crate::model::commands::search_library_element::SearchLibraryElement;
use crate::model::commands::update_component::UpdateComponent;
use crate::model::commands::update_container::UpdateContainer;
use crate::model::commands::update_person::UpdatePerson;
use crate::model::commands::update_system::UpdateSystem;
use clap::{Parser, Subcommand};
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
  /// Returns the dependents of a an architectural element with the given alias in the given diagram.
  FindDependentElements(FindDependentElements),

  /// Returns the diagrams in the project. The returned object is a map where the keys represent the diagrams' types, and the values represent the diagrams' names.
  ListDiagrams,

  /// Returns the elements in the project's library. The returned object is a map where the keys represent the elements' types, and the values represent the elements in the library.
  ListLibraryElements,

  /// Read a diagram
  ReadDiagram(ReadDiagram),

  /// Search for the given string in the project's files and replace the found occurrences with the given replacement string.
  SearchAndReplace(SearchAndReplace),

  /// Search for the project's diagrams that include the element with the given alias.
  SearchDiagramElement(SearchDiagramElement),

  /// Search in the project's library for an element with the given alias.
  SearchLibraryElement(SearchLibraryElement),

  /// Create a person in the project's library.
  CreatePerson(CreatePerson),

  /// Create a software system in the project's library.
  CreateSystem(CreateSystem),

  /// Create a container in the project's library.
  CreateContainer(CreateContainer),

  /// Create a component in the project's library.
  CreateComponent(CreateComponent),

  /// Update a person in the project's library.
  ///
  /// This command will update a person in the project's library
  /// and will update all the diagrams that import it.
  UpdatePerson(UpdatePerson),

  /// Update a software system in the project's library.
  ///
  /// This command will update a software system in the project's library
  /// and will update all the diagrams that import it.
  UpdateSystem(UpdateSystem),

  /// Update a container in the project's library.
  ///
  /// This command will update a container in the project's library
  /// and will update all the diagrams that import it.
  UpdateContainer(UpdateContainer),

  /// Update a component in the project's library.
  ///
  /// This command will update a component in the project's library
  /// and will update all the diagrams that import it.
  UpdateComponent(UpdateComponent),

  /// Create or update a person (and the dependent diagrams) in the project's library.
  UpsertPerson(UpdatePerson),

  /// Create or update a software system (and the dependent diagrams) in the project's library.
  UpsertSystem(UpdateSystem),

  /// Create or update a container (and the dependent diagrams) in the project's library.
  UpsertContainer(UpdateContainer),

  /// Create or update a component (and the dependent diagrams) in the project's library.
  UpsertComponent(UpdateComponent),
}
