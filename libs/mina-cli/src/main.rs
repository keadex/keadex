pub mod commands;
pub mod constants;
pub mod helpers;
pub mod model;

use crate::commands::create_project::create_project;
use crate::commands::find_dependent_elements::find_dependent_elements;
use crate::commands::list_diagrams;
use crate::commands::list_library_elements::list_library_elements;
use crate::commands::read_all_diagrams::read_all_diagrams;
use crate::commands::read_diagram::read_diagram;
use crate::commands::search_and_replace::search_and_replace;
use crate::commands::search_diagram_element::search_diagram_element;
use crate::commands::search_library_element::search_library_element;
use crate::commands::upsert_component::upsert_component;
use crate::commands::upsert_container::upsert_container;
use crate::commands::upsert_person::upsert_person;
use crate::commands::upsert_system::upsert_system;
use crate::commands::validate_project::validate_project;
use crate::helpers::mina_lifecycle_helper::{clear_keadex_mina, init_keadex_mina};
use crate::list_diagrams::list_diagrams;
use crate::model::response::Response;
use clap::Parser;
use keadex_mina::core::serializer::serialize_obj_to_json_string;
use mina_mcp_server::services::library_service::{
  create_component, create_container, create_person, create_system, update_component,
  update_container, update_person, update_system,
};
use model::cli::{Cli, Commands};

#[tokio::main]
async fn main() {
  let args = Cli::parse();

  if args.markdown_help {
    clap_markdown::print_help_markdown::<Cli>();
  } else {
    let mut result;
    match &args.cmd {
      Commands::CreateProject(_) | Commands::ValidateProject => {
        result = init_keadex_mina(None).await.map(|_| ());
      }
      _ => {
        result = init_keadex_mina(Some(&args.project_path)).await.map(|_| ());
      }
    }
    if let Err(error) = result {
      eprintln!("Error: {}", error.msg)
    } else {
      match args.cmd {
        Commands::CreateProject(mut create_project_args) => {
          create_project_args.root = args.project_path.to_str().unwrap().to_string();
          result = create_project(create_project_args).await;
        }
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
        Commands::ReadAllDiagrams => {
          result = read_all_diagrams().await;
        }
        Commands::SearchAndReplace(args) => {
          result = search_and_replace(args).await;
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
        Commands::ValidateProject => {
          result = validate_project(args.project_path.to_str().unwrap()).await;
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
