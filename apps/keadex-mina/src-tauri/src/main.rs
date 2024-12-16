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
use keadex_mina::__cmd__create_diagram;
use keadex_mina::__cmd__create_project;
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
use keadex_mina::__cmd__save_spec_diagram_raw_plantuml;
use keadex_mina::controller::ai_controller::generate_plantuml;
use keadex_mina::controller::diagram_controller::__cmd__dependent_elements_in_diagram;
use keadex_mina::controller::diagram_controller::__cmd__deserialize_plantuml_by_string;
use keadex_mina::controller::diagram_controller::__cmd__diagram_from_link_string;
use keadex_mina::controller::diagram_controller::__cmd__diagram_name_type_from_path;
use keadex_mina::controller::diagram_controller::__cmd__get_diagram;
use keadex_mina::controller::diagram_controller::close_diagram;
use keadex_mina::controller::diagram_controller::create_diagram;
use keadex_mina::controller::diagram_controller::delete_diagram;
use keadex_mina::controller::diagram_controller::dependent_elements_in_diagram;
use keadex_mina::controller::diagram_controller::deserialize_plantuml_by_string;
use keadex_mina::controller::diagram_controller::diagram_from_link_string;
use keadex_mina::controller::diagram_controller::diagram_name_type_from_path;
use keadex_mina::controller::diagram_controller::diagram_to_link_string;
use keadex_mina::controller::diagram_controller::export_diagram_to_file;
use keadex_mina::controller::diagram_controller::get_diagram;
use keadex_mina::controller::diagram_controller::list_diagrams;
use keadex_mina::controller::diagram_controller::open_diagram;
use keadex_mina::controller::diagram_controller::parsed_element_to_plantuml;
use keadex_mina::controller::diagram_controller::save_spec_diagram_raw_plantuml;
use keadex_mina::controller::hook_controller::__cmd__execute_hook;
use keadex_mina::controller::library_controller::__cmd__create_library_element;
use keadex_mina::controller::library_controller::__cmd__library_element_type_from_path;
use keadex_mina::controller::library_controller::__cmd__update_library_element;
use keadex_mina::controller::library_controller::create_library_element;
use keadex_mina::controller::library_controller::delete_library_element;
use keadex_mina::controller::library_controller::library_element_type_from_path;
use keadex_mina::controller::library_controller::list_library_elements;
use keadex_mina::controller::library_controller::update_library_element;
use keadex_mina::controller::project_controller::close_project;
use keadex_mina::controller::project_controller::create_project;
use keadex_mina::controller::project_controller::open_project;
use keadex_mina::controller::search_controller::__cmd__search;
use keadex_mina::controller::search_controller::__cmd__search_diagram_element_alias;
use keadex_mina::controller::search_controller::search;
use keadex_mina::controller::search_controller::search_diagram_element_alias;
use keadex_mina::repository::project_repository::save_project_settings;
use keadex_mina::service::hook_service::execute_hook;
use tauri::Manager;
use tauri::WebviewWindowBuilder;

fn main() {
  dotenv().ok();
  keadex_mina::core::logger::init();
  let _app = keadex_mina::core::app::App::default();
  tauri::Builder::default()
    .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
      let _ = app
        .get_webview_window("main")
        .expect("no main window")
        .set_focus();
    }))
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_deep_link::init())
    .setup(|app| {
      #[cfg(any(windows, target_os = "linux"))]
      {
        use tauri_plugin_deep_link::DeepLinkExt;
        app.deep_link().register_all()?;
      }
      WebviewWindowBuilder::new(
        app,
        "main".to_string(),
        tauri::WebviewUrl::App("index.html".into()),
      )
      .transparent(true)
      .decorations(false)
      .title("Keadex Mina")
      .inner_size(1080.0, 800.0)
      .resizable(true)
      .center()
      .build()?;
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      close_diagram,
      close_project,
      create_diagram,
      create_library_element,
      create_project,
      delete_diagram,
      delete_library_element,
      deserialize_plantuml_by_string,
      diagram_from_link_string,
      diagram_name_type_from_path,
      diagram_to_link_string,
      dependent_elements_in_diagram,
      execute_hook,
      export_diagram_to_file,
      generate_plantuml,
      get_diagram,
      library_element_type_from_path,
      list_diagrams,
      list_library_elements,
      open_diagram,
      open_project,
      parsed_element_to_plantuml,
      save_project_settings,
      save_spec_diagram_raw_plantuml,
      search,
      search_diagram_element_alias,
      update_library_element,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
