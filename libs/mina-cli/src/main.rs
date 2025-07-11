pub mod commands;
pub mod constants;
pub mod model;

use crate::list_diagrams::list_diagrams;
use crate::model::response::Response;
use clap::Parser;
use commands::create_component::create_component;
use commands::create_container::create_container;
use commands::create_person::create_person;
use commands::create_system::create_system;
use commands::find_dependent_elements::find_dependent_elements;
use commands::list_diagrams;
use commands::list_library_elements::list_library_elements;
use commands::read_diagram::read_diagram;
use commands::search_diagram_element::search_diagram_element;
use commands::search_library_element::search_library_element;
use commands::update_component::update_component;
use commands::update_container::update_container;
use commands::update_person::update_person;
use commands::update_system::update_system;
use commands::upsert_component::upsert_component;
use commands::upsert_container::upsert_container;
use commands::upsert_person::upsert_person;
use commands::upsert_system::upsert_system;
use keadex_mina::core::project_initializer::{load_project, unload_project};
use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use model::cli::{Cli, Commands};
use std::path::PathBuf;

async fn init_keadex_mina(project_path: &PathBuf) -> Result<(), MinaError> {
  let _app = keadex_mina::core::app::App::new();
  let _project = load_project(project_path.to_str().unwrap()).await?;
  return Ok(());
}

async fn clear_keadex_mina(project_path: &PathBuf) {
  let _ = unload_project(project_path.to_str().unwrap()).await;
}

#[tokio::main]
async fn main() {
  let args = Cli::parse();

  if args.markdown_help {
    clap_markdown::print_help_markdown::<Cli>();
  } else {
    let mut result = init_keadex_mina(&args.project_path).await;
    if let Err(error) = result {
      eprintln!("Error: {}", error.msg)
    } else {
      match args.cmd {
        Commands::FindDependentElements(args) => {
          result =
            find_dependent_elements(&args.alias, &args.diagram_name, args.diagram_type).await;
        }
        Commands::ListDiagrams => {
          result = list_diagrams().await;
        }
        Commands::ListLibraryElements => {
          result = list_library_elements().await;
        }
        Commands::ReadDiagram(read_diagram_args) => {
          result = read_diagram(
            &read_diagram_args.diagram_name,
            read_diagram_args.diagram_type,
          )
          .await;
        }
        Commands::SearchDiagramElement(args) => {
          result = search_diagram_element(&args.alias).await;
        }
        Commands::SearchLibraryElement(search_args) => {
          result = search_library_element(&search_args.alias).await;
        }
        Commands::CreateComponent(args) => {
          result = create_component(args).await;
        }
        Commands::CreateContainer(args) => {
          result = create_container(args).await;
        }
        Commands::CreatePerson(args) => {
          result = create_person(args).await;
        }
        Commands::CreateSystem(args) => {
          result = create_system(args).await;
        }
        Commands::UpdatePerson(update_person_args) => {
          result = update_person(update_person_args).await;
        }
        Commands::UpdateSystem(update_system_args) => {
          result = update_system(update_system_args).await;
        }
        Commands::UpdateContainer(update_container_args) => {
          result = update_container(update_container_args).await;
        }
        Commands::UpdateComponent(update_component_args) => {
          result = update_component(update_component_args).await;
        }
        Commands::UpsertPerson(upsert_person_args) => {
          result = upsert_person(upsert_person_args).await;
        }
        Commands::UpsertSystem(upsert_system_args) => {
          result = upsert_system(upsert_system_args).await;
        }
        Commands::UpsertContainer(upsert_container_args) => {
          result = upsert_container(upsert_container_args).await;
        }
        Commands::UpsertComponent(upsert_component_args) => {
          result = upsert_component(upsert_component_args).await;
        }
      }
      if let Err(error) = result {
        let response = Response {
          code: error.code,
          message: error.msg,
        };
        let json = serialize_obj_to_json_string(&response, false).unwrap();
        eprintln!("{}", json);
      }
      clear_keadex_mina(&args.project_path).await;
    }
  }
}
