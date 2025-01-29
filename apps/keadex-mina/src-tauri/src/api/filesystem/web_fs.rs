use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI;
use crate::error_handling::errors::CANNOT_OPEN_FILE_ERROR_MSG;
use crate::error_handling::errors::FILE_DOES_NOT_EXIST;
use crate::error_handling::errors::INVALID_PATH_ERROR_MSG;
use crate::error_handling::errors::MISSING_ROOT_DIR_HANDLE;
use crate::helper::fs_helper::split_path_components;
use crate::helper::fs_helper::PathStructure;
use js_sys::Array;
use js_sys::AsyncIterator;
use js_sys::Uint8Array;
use std::io::Cursor;
use std::io::Error;
use std::io::Read;
use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::JsFuture;
use web_sys::FileSystemFileHandle;
use web_sys::{File, FileSystemDirectoryHandle};

// ----------- WebFile
#[derive(Debug)]
pub struct WebFile {
  file: File,
}

impl WebFile {
  pub fn new(&mut self, file: File) -> Self {
    Self { file }
  }
}
impl CrossFile for WebFile {
  fn unlock(&self) -> Result<(), Error> {
    return Ok(());
  }

  fn lock_exclusive(&self) -> Result<(), Error> {
    return Ok(());
  }

  async fn get_buffer(&self) -> impl Read {
    let array_buffer = JsFuture::from((&self.file).array_buffer()).await.unwrap();
    let uint8_array = Uint8Array::new(&array_buffer);
    let mut data = vec![0; uint8_array.length() as usize];
    uint8_array.copy_to(&mut data);
    return Cursor::new(data);
  }
}

// ----------- WebFileSystemAPI
#[derive(Default)]
pub struct WebFileSystemAPI {
  pub root_dir_handle: Option<FileSystemDirectoryHandle>,
}

impl WebFileSystemAPI {
  pub async fn open_web_file(
    &self,
    dir_handle: &FileSystemDirectoryHandle,
    path_structure: &mut PathStructure,
  ) -> Result<WebFile, JsValue> {
    if let Some(file_name) = &path_structure.file_name {
      let iterator = dir_handle.entries();
      let async_iterator = AsyncIterator::from(iterator);

      let dir_to_open = path_structure.directories.pop_front();
      // console::log_1(&JsValue::from_str("Dir"));
      // console::log_1(&JsValue::from_str(format!("{:?}", dir_to_open).as_str()));
      loop {
        let next_promise = async_iterator.next();
        let next_result = JsFuture::from(next_promise?).await?;

        // The result is an object with `{ value, done }`
        let next_obj = js_sys::Object::from(next_result);

        // Check if the iterator is done
        let done = js_sys::Reflect::get(&next_obj, &JsValue::from_str("done"))?
          .as_bool()
          .unwrap_or(false);

        if done {
          break;
        }

        // Get the `value` field, which is an array `[key, value]`
        let value = js_sys::Reflect::get(&next_obj, &JsValue::from_str("value"))?;
        let pair: Array = value.into();

        // Extract the key and value from the array
        let name = pair.get(0).as_string().unwrap_or_default();
        let handle = pair.get(1);

        // Check if it's a file or directory handle
        if handle.is_instance_of::<FileSystemFileHandle>() {
          // console::log_2(&JsValue::from_str("File"), &JsValue::from(&name));
          if name.eq(file_name) {
            // console::log_2(
            //     &JsValue::from_str("File found! Opening it!"),
            //     &JsValue::from(name),
            // );
            let file_handle = &handle.dyn_into::<FileSystemFileHandle>().unwrap();
            let file_result = JsFuture::from(file_handle.get_file()).await;
            if file_result.is_ok() {
              return Ok(WebFile {
                file: file_result.unwrap().dyn_into::<File>()?,
              });
            } else {
              return Err(file_result.unwrap_err());
            }
          }
        } else if handle.is_instance_of::<FileSystemDirectoryHandle>() {
          // console::log_2(&JsValue::from_str("Directory"), &JsValue::from(&name));
          if let Some(dir_to_open) = &dir_to_open {
            if name.eq(dir_to_open) {
              // This directory is part of the path to open
              // console::log_2(&JsValue::from_str("Found"), &JsValue::from(&name));
              return Box::pin(self.open_web_file(
                &handle.dyn_into::<FileSystemDirectoryHandle>().unwrap(),
                path_structure,
              ))
              .await;
            }
          }
        }
      }
    } else {
      return Err(JsValue::from_str(INVALID_PATH_ERROR_MSG));
    }

    Err(JsValue::from_str(FILE_DOES_NOT_EXIST))
  }
}

impl FileSystemAPI for WebFileSystemAPI {
  async fn open(
    &self,
    read: bool,
    write: bool,
    append: bool,
    truncate: bool,
    path: &str,
  ) -> Result<impl CrossFile, Error> {
    if let Some(root_dir_handle) = &self.root_dir_handle {
      let mut path_structure = split_path_components(path);
      let result = self
        .open_web_file(root_dir_handle, &mut path_structure)
        .await;
      if result.is_ok() {
        return Ok(result.unwrap());
      } else {
        return Err(Error::new(
          std::io::ErrorKind::InvalidInput,
          result
            .unwrap_err()
            .as_string()
            .unwrap_or(CANNOT_OPEN_FILE_ERROR_MSG.to_string()),
        ));
      }
    } else {
      return Err(Error::new(
        std::io::ErrorKind::NotFound,
        MISSING_ROOT_DIR_HANDLE,
      ));
    }
  }
}
