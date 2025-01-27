pub mod binary_dao;
pub mod diagram;
pub mod library;
pub mod project_settings_dao;

use crate::core::serializer::{deserialize_json_by_file, serialize_obj_to_json_string};
use crate::dao::DAO;
use crate::error_handling::errors::{
  CANNOT_OPEN_FILE_ERROR_MSG, FILE_DOES_NOT_EXIST, IO_ERROR_CODE, NO_CACHED_FILE_ERROR_MSG,
};
use crate::error_handling::mina_error::MinaError;
use fs2::*;
use serde::de;
use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::fs::{File, OpenOptions};
use std::future::Future;
use std::io::Write;
use std::path::Path;

/**
Specialization of the DAO to interact with data stored in the file system.
*/
pub trait FileSystemDAO<T: serde::Serialize + std::fmt::Debug + std::marker::Sync>: DAO {
  /*
    I need to cache the opened files because in order to lock a file for the entire
    duration of the application, the reference to the "File" must not to be destroyed
    starting from the time you lock it.
  */
  fn get_opened_files(&mut self) -> &mut HashMap<String, File>;

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
  ) -> impl Future<Output = Result<&mut File, MinaError>> + Send
  where
    Self: std::marker::Send,
  {
    async move {
      // log::debug!("Open and unlock file {:?}", path);
      let file = OpenOptions::new()
        .read(true)
        .write(true)
        .append(append)
        .truncate(truncate)
        .open(path);
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
        log::error!("{}", error);
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
        log::error!("{}", error);
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
  fn get(&mut self, path: &Path) -> impl std::future::Future<Output = Result<T, MinaError>> + Send
  where
    T: de::DeserializeOwned,
    Self: std::marker::Send,
  {
    async {
      let file = self.open_and_unlock_file(path, true, false).await?;
      let result = deserialize_json_by_file::<T>(&file, path)?;
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
  fn get_all(
    &mut self,
    path: &Path,
  ) -> impl std::future::Future<Output = Result<Vec<T>, MinaError>> + Send
  where
    T: de::DeserializeOwned,
    Self: std::marker::Send,
  {
    async {
      let file = self.open_and_unlock_file(path, true, false).await?;
      let results = deserialize_json_by_file::<Vec<T>>(&file, path)?;
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
  ) -> impl std::future::Future<Output = Result<(), MinaError>> + Send
  where
    Self: std::marker::Send + std::marker::Sync,
  {
    async move {
      if !Path::new(&path).exists() {
        if create_if_not_exist {
          File::create(&path)?;
        } else {
          return Err(MinaError::new(IO_ERROR_CODE, FILE_DOES_NOT_EXIST));
        }
      }
      let file = self.open_and_unlock_file(path, false, true).await?;
      let serialized_json = serialize_obj_to_json_string(data, true)?;
      file.write_all(serialized_json.as_bytes())?;
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
  ) -> impl std::future::Future<Output = Result<(), MinaError>> + Send
  where
    Self: std::marker::Send,
  {
    async {
      let file = self.open_and_unlock_file(path, false, true).await?;
      let serialized_json = serialize_obj_to_json_string(data, true)?;
      file.write_all(serialized_json.as_bytes())?;
      let _ = self.lock_file(path);
      Ok(())
    }
  }

  /**
  Unlocks, removes from the cache and deletes a file, given its path.
  # Arguments
    * `path` - Path of the file to delete
  */
  fn delete(&mut self, path: &Path) -> Result<(), MinaError> {
    // Ignoring a possible error during unlock, since it reasonable that a diagram could not
    // be opened before the deletion.
    let _ = self.unlock_file(path, true);
    std::fs::remove_file(path)?;
    Ok(())
  }
}
