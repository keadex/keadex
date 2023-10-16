/*!
Modules containing application's Menu logic.
*/

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

/**
Creates the global menu
*/
pub fn create_global_menu() -> Menu {
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let close = CustomMenuItem::new("close".to_string(), "Close");
  let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
  Menu::new()
    .add_native_item(MenuItem::Copy)
    .add_item(CustomMenuItem::new("hide", "Hide"))
    .add_submenu(submenu)
}

/**
Creates menu showed in the home page
*/
pub fn create_home_menu() -> Menu {
  Menu::new().add_submenu(create_help_menu_item())
}

/**
Creates "Help" menu item
*/
pub fn create_help_menu_item() -> Submenu {
  let documentation = CustomMenuItem::new("documentation".to_string(), "Documentation");
  let repository = CustomMenuItem::new("repository".to_string(), "Repository");
  let report_issue = CustomMenuItem::new("report_issue".to_string(), "Report an issue");
  let check_updates = CustomMenuItem::new("check_updates".to_string(), "Check for updates");
  let about = CustomMenuItem::new("about".to_string(), "About");
  Submenu::new(
    "Help",
    Menu::new()
      .add_item(documentation)
      .add_item(repository)
      .add_item(report_issue)
      .add_item(check_updates)
      .add_item(about),
  )
}
