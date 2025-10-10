use crate::error_handling::mina_error::MinaError;
use crate::model::user_settings::UserSettings;
use crate::repository::app_settings_repository;
use keadex_mina_macro::web_controller;

/**
Returns the user settings
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn get_user_settings() -> Result<UserSettings, MinaError> {
  app_settings_repository::get_user_settings().await
}

/**
Stores the given user settings and returns them.
# Arguments
  * `user_settings` - Updated user settings.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn save_user_settings(user_settings: UserSettings) -> Result<UserSettings, MinaError> {
  app_settings_repository::save_user_settings(user_settings).await
}
