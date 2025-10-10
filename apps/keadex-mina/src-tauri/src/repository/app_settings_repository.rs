use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::AppSettingsFsDAO;
use crate::dao::filesystem::app_settings_dao::USER_SETTINGS_KEY;
use crate::error_handling::mina_error::MinaError;
use crate::model::user_settings::UserSettings;
use crate::resolve_to_write;

/**
Returns the user settings
*/
pub async fn get_user_settings() -> Result<UserSettings, MinaError> {
  let store = ROOT_RESOLVER.get().read().await;
  let stored_user_settings: UserSettings = resolve_to_write!(store, AppSettingsFsDAO)
    .await
    .get(USER_SETTINGS_KEY)
    .await
    .unwrap();
  Ok(stored_user_settings)
}

/**
Stores the given user settings and returns them.
# Arguments
  * `updated_user_settings` - Updated user settings.
*/
pub async fn save_user_settings(
  updated_user_settings: UserSettings,
) -> Result<UserSettings, MinaError> {
  let store = ROOT_RESOLVER.get().read().await;
  resolve_to_write!(store, AppSettingsFsDAO)
    .await
    .save(USER_SETTINGS_KEY, &updated_user_settings)
    .await?;
  Ok(updated_user_settings)
}
