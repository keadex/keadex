use crate::dao::DAO;
use crate::error_handling::mina_error::MinaError;
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::json;
use std::fmt::Debug;

pub const FILE_NAME: &str = "settings.json";

pub const USER_SETTINGS_KEY: &str = "user_settings";

/**
Allows to read/write App Settings data from/to the file system.
*/
#[derive(Default)]
pub struct AppSettingsDAO {}

impl DAO for AppSettingsDAO {}

impl AppSettingsDAO {
  pub async fn get<T: DeserializeOwned + Default>(&mut self, key: &str) -> Result<T, MinaError> {
    #[cfg(desktop)]
    {
      let store = tauri_plugin_store::StoreBuilder::new(crate::core::app::app_handle(), FILE_NAME)
        .build()
        .unwrap();
      let settings_option = store.get(key);
      if let Some(settings) = settings_option {
        Ok(serde_json::from_value(settings).unwrap())
      } else {
        Ok(T::default())
      }
    }
    #[cfg(web)]
    {
      let storage = web_sys::window().unwrap().local_storage().unwrap().unwrap();
      let settings_option = storage.get(key).unwrap();
      if let Some(settings) = settings_option {
        Ok(serde_json::from_str::<T>(&settings).unwrap())
      } else {
        Ok(T::default())
      }
    }
  }
  pub async fn save<T: Serialize + Default + Debug>(
    &mut self,
    key: &str,
    data: &T,
  ) -> Result<(), MinaError> {
    #[cfg(desktop)]
    {
      let store = tauri_plugin_store::StoreBuilder::new(crate::core::app::app_handle(), FILE_NAME)
        .build()
        .unwrap();
      store.set(key, json!(data));
      Ok(())
    }
    #[cfg(web)]
    {
      use crate::core::serializer::serialize_obj_to_json_string;

      let storage = web_sys::window().unwrap().local_storage().unwrap().unwrap();
      let _ = storage.set(key, &serialize_obj_to_json_string(data, false)?)?;
      Ok(())
    }
  }
}
