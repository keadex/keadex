pub mod app_settings_dao;
pub mod binary_dao;
pub mod diagram;
pub mod library;
pub mod project_settings_dao;

use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI as FsApiTrait;
use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::FileSystemAPI;
use crate::core::serializer::{deserialize_json_by_file, serialize_obj_to_json_string};
use crate::dao::DAO;
use crate::error_handling::errors::{
  CANNOT_OPEN_FILE_ERROR_MSG, FILE_DOES_NOT_EXIST, IO_ERROR_CODE, NO_CACHED_FILE_ERROR_MSG,
};
use crate::error_handling::mina_error::MinaError;
use crate::resolve_to_write;
use serde::de;
use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::future::Future;
use std::path::Path;

/**
Specialization of the DAO to interact with data stored in the file system.
*/
pub trait FileSystemDAO<T: serde::Serialize + std::fmt::Debug + Sync>: DAO {
  /*
    I need to cache the opened files because in order to lock a file for the entire
    duration of the application, the reference to the "File" must not to be destroyed
    starting from the time you lock it.
  */
  fn get_opened_files(&mut self) -> &mut HashMap<String, Box<dyn CrossFile>>;

  /**
  Opens, unlocks and returns the requested file
  # Arguments
    * `path` - Path of the file
  */
  fn open_and_unlock_file(
    &mut self,
    path: &Path,
    append: bool,
    truncate: bool,
  ) -> impl Future<Output = Result<&mut Box<dyn CrossFile>, MinaError>> {
    async move {
      // log::debug!("Open and unlock file {:?}", path);
      let store = ROOT_RESOLVER.get().read().await;
      let file = resolve_to_write!(store, FileSystemAPI)
        .await
        .open(true, true, append, truncate, &path)
        .await;
      match file {
        Ok(file) => {
          let _ = file.unlock();
          self.get_opened_files().remove(path.to_str().unwrap());
          if let Entry::Vacant(v) = self
            .get_opened_files()
            .entry(path.to_str().unwrap().to_string())
          {
            // log::debug!("Update cached file {:?}", path);
            return Ok(v.insert(file));
          }
        }
        Err(error) => {
          log::error!("{}", error);
          return Err(error.into());
        }
      }
      let error = MinaError::new(IO_ERROR_CODE, CANNOT_OPEN_FILE_ERROR_MSG);
      log::error!("{}", error);
      Err(error)
    }
  }

  /**
  Locks the given file
  # Arguments
    * `path` - Path of the file
  */
  fn lock_file(&mut self, path: &Path) -> Result<bool, MinaError> {
    // log::debug!("Lock file {:?}", path);
    let file = self
      .get_opened_files()
      .entry(path.to_str().unwrap().to_string());
    match file {
      Entry::Occupied(o) => {
        let file = o.into_mut();
        let _ = file.lock_exclusive();
        Ok(true)
      }
      Entry::Vacant(_) => {
        let error = MinaError::new(IO_ERROR_CODE, NO_CACHED_FILE_ERROR_MSG);
        log::warn!("{}", error);
        // Commented the following line since it is not really required to trigger an error
        // Err(error)
        Ok(true)
      }
    }
  }

  /**
  Unlocks all the opened files
  # Arguments
    * `path` - Path of the file
    * `remove_from_cache` - If the opened files should also be removed from the cache
  */
  fn unlock_all_files(&mut self, remove_from_cache: bool) -> Result<bool, MinaError> {
    // log::debug!("Unlock all files");
    let opened_files: Vec<String> = self
      .get_opened_files()
      .keys()
      .cloned()
      .collect::<Vec<String>>();
    for opened_file in opened_files {
      self.unlock_file(Path::new(&opened_file), remove_from_cache)?;
    }
    Ok(true)
  }

  /**
  Unlocks the given file
  # Arguments
    * `path` - Path of the file
    * `remove_from_cache` - If the file should also be removed from the cache
  */
  fn unlock_file(&mut self, path: &Path, remove_from_cache: bool) -> Result<bool, MinaError> {
    // log::debug!("Unlock file {:?}", path);
    let file = self
      .get_opened_files()
      .entry(path.to_str().unwrap().to_string());
    match file {
      Entry::Occupied(o) => {
        let file = o.into_mut();
        let _ = file.unlock();
        if remove_from_cache {
          self
            .get_opened_files()
            .remove(&path.to_str().unwrap().to_string());
        }
        Ok(true)
      }
      Entry::Vacant(_) => {
        let error = MinaError::new(IO_ERROR_CODE, NO_CACHED_FILE_ERROR_MSG);
        log::warn!("{}", error);
        // Commented the following line since it is not really required to trigger an error
        // Err(error)
        Ok(true)
      }
    }
  }

  /**
  Reads, parses and returns an object "T" from a file.
  By default, when a file is read by Mina, after the reading it locks the
  file in order to prevent changes by external applications and, as a consequence,
  the invalidation of the internal state.
  # Arguments
    * `path` - Path of the file
  */
  fn get(&mut self, path: &Path) -> impl Future<Output = Result<T, MinaError>>
  where
    T: de::DeserializeOwned,
  {
    async {
      let mut file = self.open_and_unlock_file(path, true, false).await?;
      let result = deserialize_json_by_file::<T>(&mut file, path).await?;
      let _ = self.lock_file(path);
      Ok(result)
    }
  }

  /**
  Reads, parses and returns an array of objects "T" from a file.
  By default, when a file is read by Mina, after the reading it locks the
  file in order to prevent changes by external applications and, as a consequence,
  the invalidation of the internal state.
  # Arguments
    * `path` - Path of the file
  */
  fn get_all(&mut self, path: &Path) -> impl Future<Output = Result<Vec<T>, MinaError>>
  where
    T: de::DeserializeOwned,
  {
    async {
      let mut file = self.open_and_unlock_file(path, true, false).await?;
      let results = deserialize_json_by_file::<Vec<T>>(&mut file, path).await?;
      let _ = self.lock_file(path);
      Ok(results)
    }
  }

  /**
  Serializes to json the given object. Saves it into the file referenced
  by the the provided path (after opening and unlocking it), and locks again the file.
  # Arguments
    * `data` - Data to save
    * `path` - Path of the file in which save the data
    * `create_if_not_exist` - If you want to create the file if it does not exist
  */
  fn save(
    &mut self,
    data: &T,
    path: &Path,
    create_if_not_exist: bool,
  ) -> impl Future<Output = Result<(), MinaError>> {
    async move {
      let store = ROOT_RESOLVER.get().read().await;
      if !resolve_to_write!(store, FileSystemAPI)
        .await
        .path_exists(Path::new(&path))
        .await?
      {
        if create_if_not_exist {
          resolve_to_write!(store, FileSystemAPI)
            .await
            .create(&path)
            .await?;
        } else {
          return Err(MinaError::new(IO_ERROR_CODE, FILE_DOES_NOT_EXIST));
        }
      }
      let file = self.open_and_unlock_file(path, false, true).await?;
      let serialized_json = serialize_obj_to_json_string(data, true)?;
      file.write_all(serialized_json.as_bytes()).await?;
      let _ = self.lock_file(path);
      Ok(())
    }
  }

  /**
  Serializes to json the given array of objects. Saves them into the file referenced
  by the the provided path (after opening and unlocking it), and locks again the file.
  # Arguments
    * `data` - Data to save
    * `path` - Path of the file in which save the data
  */
  fn save_all(
    &mut self,
    data: &Vec<T>,
    path: &Path,
  ) -> impl Future<Output = Result<(), MinaError>> {
    async {
      let file = self.open_and_unlock_file(path, false, true).await?;
      let serialized_json = serialize_obj_to_json_string(data, true)?;
      file.write_all(serialized_json.as_bytes()).await?;
      let _ = self.lock_file(path);
      Ok(())
    }
  }

  /**
  Unlocks, removes from the cache and deletes a file, given its path.
  # Arguments
    * `path` - Path of the file to delete
  */
  fn delete(&mut self, path: &Path) -> impl Future<Output = Result<(), MinaError>> {
    async {
      // Ignoring a possible error during unlock, since it reasonable that a diagram could not
      // be opened before the deletion.
      let _ = self.unlock_file(path, true);

      let store = ROOT_RESOLVER.get().read().await;
      resolve_to_write!(store, FileSystemAPI)
        .await
        .remove_file(path)
        .await?;
      Ok(())
    }
  }
}
