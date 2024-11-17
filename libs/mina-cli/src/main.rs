pub mod commands;
pub mod model;

use clap::Parser;
use commands::search_library_element::search_library_element;
use commands::update_component::update_component;
use commands::update_container::update_container;
use commands::update_person::update_person;
use commands::update_system::update_system;
use keadex_mina::core::project_initializer::{load_project, unload_project};
use keadex_mina::error_handling::mina_error::MinaError;
use model::cli::{Cli, Commands};
use std::path::PathBuf;

fn init_keadex_mina(project_path: &PathBuf) -> Result<(), MinaError> {
  let _app = keadex_mina::core::app::App::default();
  let _project = load_project(project_path.to_str().unwrap())?;
  return Ok(());
}

fn clear_keadex_mina(project_path: &PathBuf) {
  let _ = unload_project(project_path.to_str().unwrap());
}

fn main() {
  let args = Cli::parse();

  if args.markdown_help {
    clap_markdown::print_help_markdown::<Cli>();
  } else {
    let mut result = init_keadex_mina(&args.project_path);
    if let Err(error) = result {
      eprintln!("Error: {}", error.msg)
    } else {
      match args.cmd {
        Commands::SearchLibraryElement(search_args) => {
          result = search_library_element(&search_args.alias);
        }
        Commands::UpdatePerson(update_person_args) => {
          result = update_person(update_person_args);
        }
        Commands::UpdateSystem(update_system_args) => {
          result = update_system(update_system_args);
        }
        Commands::UpdateContainer(update_container_args) => {
          result = update_container(update_container_args);
        }
        Commands::UpdateComponent(update_component_args) => {
          result = update_component(update_component_args);
        }
      }
      if let Err(error) = result {
        eprintln!("Error: {}", error.msg)
      } else {
        println!("Done!")
      }
      clear_keadex_mina(&args.project_path);
    }
  }
}