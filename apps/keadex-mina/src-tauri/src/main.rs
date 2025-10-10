/*!
Keadex Mina
This is the main entrypoint for the desktop app.
*/

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(desktop)]
use {
  keadex_mina::__cmd__close_diagram, keadex_mina::__cmd__close_project,
  keadex_mina::__cmd__create_diagram, keadex_mina::__cmd__create_project,
  keadex_mina::__cmd__delete_diagram, keadex_mina::__cmd__delete_library_element,
  keadex_mina::__cmd__diagram_to_link_string, keadex_mina::__cmd__export_diagram_to_file,
  keadex_mina::__cmd__generate_plantuml, keadex_mina::__cmd__list_diagrams,
  keadex_mina::__cmd__list_library_elements, keadex_mina::__cmd__open_diagram,
  keadex_mina::__cmd__open_project, keadex_mina::__cmd__parsed_element_to_plantuml,
  keadex_mina::__cmd__save_project_settings, keadex_mina::__cmd__save_spec_diagram_raw_plantuml,
  keadex_mina::controller::ai_controller::generate_plantuml,
  keadex_mina::controller::app_settings_controller::__cmd__get_user_settings,
  keadex_mina::controller::app_settings_controller::__cmd__save_user_settings,
  keadex_mina::controller::app_settings_controller::get_user_settings,
  keadex_mina::controller::app_settings_controller::save_user_settings,
  keadex_mina::controller::diagram_controller::__cmd__dependent_elements_in_diagram,
  keadex_mina::controller::diagram_controller::__cmd__deserialize_plantuml_by_string,
  keadex_mina::controller::diagram_controller::__cmd__diagram_from_link_string,
  keadex_mina::controller::diagram_controller::__cmd__diagram_name_type_from_path,
  keadex_mina::controller::diagram_controller::__cmd__diagram_plantuml_url_from_diagram_url,
  keadex_mina::controller::diagram_controller::__cmd__diagram_spec_url_from_diagram_url,
  keadex_mina::controller::diagram_controller::__cmd__diagram_url_from_link_string,
  keadex_mina::controller::diagram_controller::__cmd__get_diagram,
  keadex_mina::controller::diagram_controller::__cmd__open_remote_diagram,
  keadex_mina::controller::diagram_controller::close_diagram,
  keadex_mina::controller::diagram_controller::create_diagram,
  keadex_mina::controller::diagram_controller::delete_diagram,
  keadex_mina::controller::diagram_controller::dependent_elements_in_diagram,
  keadex_mina::controller::diagram_controller::deserialize_plantuml_by_string,
  keadex_mina::controller::diagram_controller::diagram_from_link_string,
  keadex_mina::controller::diagram_controller::diagram_name_type_from_path,
  keadex_mina::controller::diagram_controller::diagram_plantuml_url_from_diagram_url,
  keadex_mina::controller::diagram_controller::diagram_spec_url_from_diagram_url,
  keadex_mina::controller::diagram_controller::diagram_to_link_string,
  keadex_mina::controller::diagram_controller::diagram_url_from_link_string,
  keadex_mina::controller::diagram_controller::export_diagram_to_file,
  keadex_mina::controller::diagram_controller::get_diagram,
  keadex_mina::controller::diagram_controller::list_diagrams,
  keadex_mina::controller::diagram_controller::open_diagram,
  keadex_mina::controller::diagram_controller::open_remote_diagram,
  keadex_mina::controller::diagram_controller::parsed_element_to_plantuml,
  keadex_mina::controller::diagram_controller::save_spec_diagram_raw_plantuml,
  keadex_mina::controller::hook_controller::__cmd__execute_hook,
  keadex_mina::controller::library_controller::__cmd__create_library_element,
  keadex_mina::controller::library_controller::__cmd__library_element_type_from_path,
  keadex_mina::controller::library_controller::__cmd__update_library_element,
  keadex_mina::controller::library_controller::create_library_element,
  keadex_mina::controller::library_controller::delete_library_element,
  keadex_mina::controller::library_controller::library_element_type_from_path,
  keadex_mina::controller::library_controller::list_library_elements,
  keadex_mina::controller::library_controller::update_library_element,
  keadex_mina::controller::project_controller::__cmd__project_settings_url,
  keadex_mina::controller::project_controller::close_project,
  keadex_mina::controller::project_controller::create_project,
  keadex_mina::controller::project_controller::open_project,
  keadex_mina::controller::project_controller::project_settings_url,
  keadex_mina::controller::search_controller::__cmd__search,
  keadex_mina::controller::search_controller::__cmd__search_and_replace,
  keadex_mina::controller::search_controller::__cmd__search_diagram_element_alias,
  keadex_mina::controller::search_controller::search,
  keadex_mina::controller::search_controller::search_and_replace,
  keadex_mina::controller::search_controller::search_diagram_element_alias,
  keadex_mina::core::app::TAURI_APP_HANDLE,
  keadex_mina::repository::project_repository::save_project_settings,
  keadex_mina::service::hook_service::execute_hook, tauri::Manager, tauri::WebviewWindowBuilder,
};

fn main() {
  #[cfg(desktop)]
  {
    let _app = keadex_mina::core::app::App::init();
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
      .plugin(tauri_plugin_store::Builder::default().build())
      .setup(|app| {
        TAURI_APP_HANDLE.set(app.app_handle().to_owned()).unwrap();
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
        diagram_plantuml_url_from_diagram_url,
        diagram_spec_url_from_diagram_url,
        diagram_to_link_string,
        diagram_url_from_link_string,
        dependent_elements_in_diagram,
        execute_hook,
        export_diagram_to_file,
        generate_plantuml,
        get_diagram,
        get_user_settings,
        library_element_type_from_path,
        list_diagrams,
        list_library_elements,
        open_diagram,
        open_project,
        open_remote_diagram,
        parsed_element_to_plantuml,
        project_settings_url,
        save_project_settings,
        save_spec_diagram_raw_plantuml,
        save_user_settings,
        search,
        search_and_replace,
        search_diagram_element_alias,
        update_library_element,
      ])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  }
}
