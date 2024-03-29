/*!
Keadex Mina
This is the main entrypoint for the app.
*/

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use dotenv::dotenv;
use keadex_mina::__cmd__close_diagram;
use keadex_mina::__cmd__close_project;
use keadex_mina::__cmd__create_component;
use keadex_mina::__cmd__create_container;
use keadex_mina::__cmd__create_diagram;
use keadex_mina::__cmd__create_person;
use keadex_mina::__cmd__create_project;
use keadex_mina::__cmd__create_software_system;
use keadex_mina::__cmd__delete_diagram;
use keadex_mina::__cmd__delete_library_element;
use keadex_mina::__cmd__diagram_to_link_string;
use keadex_mina::__cmd__export_diagram_to_file;
use keadex_mina::__cmd__generate_plantuml;
use keadex_mina::__cmd__list_diagrams;
use keadex_mina::__cmd__list_library_elements;
use keadex_mina::__cmd__open_diagram;
use keadex_mina::__cmd__open_project;
use keadex_mina::__cmd__parsed_element_to_plantuml;
use keadex_mina::__cmd__save_project_settings;
use keadex_mina::__cmd__save_spec_diagram_parsed_plantuml;
use keadex_mina::__cmd__save_spec_diagram_raw_plantuml;
use keadex_mina::__cmd__update_component;
use keadex_mina::__cmd__update_container;
use keadex_mina::__cmd__update_person;
use keadex_mina::__cmd__update_software_system;
use keadex_mina::controller::ai_controller::generate_plantuml;
use keadex_mina::controller::diagram_controller::__cmd__deserialize_plantuml_by_string;
use keadex_mina::controller::diagram_controller::__cmd__diagram_from_link_string;
use keadex_mina::controller::diagram_controller::__cmd__diagram_name_type_from_path;
use keadex_mina::controller::diagram_controller::__cmd__duplicate_diagram;
use keadex_mina::controller::diagram_controller::close_diagram;
use keadex_mina::controller::diagram_controller::create_diagram;
use keadex_mina::controller::diagram_controller::delete_diagram;
use keadex_mina::controller::diagram_controller::deserialize_plantuml_by_string;
use keadex_mina::controller::diagram_controller::diagram_from_link_string;
use keadex_mina::controller::diagram_controller::diagram_name_type_from_path;
use keadex_mina::controller::diagram_controller::diagram_to_link_string;
use keadex_mina::controller::diagram_controller::duplicate_diagram;
use keadex_mina::controller::diagram_controller::export_diagram_to_file;
use keadex_mina::controller::diagram_controller::list_diagrams;
use keadex_mina::controller::diagram_controller::open_diagram;
use keadex_mina::controller::diagram_controller::parsed_element_to_plantuml;
use keadex_mina::controller::diagram_controller::save_spec_diagram_parsed_plantuml;
use keadex_mina::controller::diagram_controller::save_spec_diagram_raw_plantuml;
use keadex_mina::controller::library_controller::__cmd__library_element_type_from_path;
use keadex_mina::controller::library_controller::create_component;
use keadex_mina::controller::library_controller::create_container;
use keadex_mina::controller::library_controller::create_person;
use keadex_mina::controller::library_controller::create_software_system;
use keadex_mina::controller::library_controller::delete_library_element;
use keadex_mina::controller::library_controller::library_element_type_from_path;
use keadex_mina::controller::library_controller::list_library_elements;
use keadex_mina::controller::library_controller::update_component;
use keadex_mina::controller::library_controller::update_container;
use keadex_mina::controller::library_controller::update_person;
use keadex_mina::controller::library_controller::update_software_system;
use keadex_mina::controller::project_controller::__cmd__search;
use keadex_mina::controller::project_controller::close_project;
use keadex_mina::controller::project_controller::create_project;
use keadex_mina::controller::project_controller::open_project;
use keadex_mina::controller::project_controller::search;
use keadex_mina::repository::project_repository::save_project_settings;
use tauri::WindowBuilder;

fn main() {
  dotenv().ok();
  keadex_mina::core::logger::init();
  let _app = keadex_mina::core::app::App::default();
  tauri::Builder::default()
    .setup(|app| {
      WindowBuilder::new(
        app,
        "home".to_string(),
        tauri::WindowUrl::App("index.html".into()),
      )
      .transparent(true)
      .decorations(false)
      .title("Keadex Mina")
      .inner_size(1080.0, 768.0)
      .resizable(true)
      .center()
      .build()?;
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      close_diagram,
      close_project,
      create_component,
      create_container,
      create_diagram,
      create_person,
      create_project,
      create_software_system,
      delete_diagram,
      delete_library_element,
      deserialize_plantuml_by_string,
      diagram_from_link_string,
      diagram_name_type_from_path,
      diagram_to_link_string,
      duplicate_diagram,
      library_element_type_from_path,
      export_diagram_to_file,
      generate_plantuml,
      list_diagrams,
      list_library_elements,
      open_diagram,
      open_project,
      parsed_element_to_plantuml,
      save_project_settings,
      save_spec_diagram_raw_plantuml,
      save_spec_diagram_parsed_plantuml,
      search,
      update_component,
      update_container,
      update_person,
      update_software_system
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
