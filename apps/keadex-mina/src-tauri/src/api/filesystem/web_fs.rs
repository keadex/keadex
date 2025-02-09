use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI;
use crate::error_handling::errors::DIRECTORY_DOES_NOT_EXIST;
use crate::error_handling::errors::FILE_DOES_NOT_EXIST;
use crate::error_handling::errors::INVALID_PATH_ERROR_MSG;
use crate::error_handling::errors::IO_ERROR_CODE;
use crate::error_handling::errors::MISSING_ROOT_DIR_HANDLE;
use crate::error_handling::mina_error::MinaError;
use crate::helper::fs_helper::split_path_components;
use crate::helper::fs_helper::PathStructure;
use async_trait::async_trait;
use js_sys::Array;
use js_sys::AsyncIterator;
use js_sys::Uint8Array;
use std::io::Cursor;
use std::io::Read;
use std::path::Path;
use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::JsFuture;
use web_sys::FileSystemFileHandle;
use web_sys::FileSystemGetDirectoryOptions;
use web_sys::FileSystemGetFileOptions;
use web_sys::FileSystemWritableFileStream;
use web_sys::{File, FileSystemDirectoryHandle};

// ----------- WebFile
#[derive(Debug)]
pub struct WebFile {
  file_handle: FileSystemFileHandle,
}

impl WebFile {
  pub fn new(&mut self, file_handle: FileSystemFileHandle) -> Self {
    Self { file_handle }
  }

  async fn write_web_file(&mut self, data: &[u8]) -> Result<(), JsValue> {
    let writable = JsFuture::from(self.file_handle.create_writable()).await?;
    let writable_stream: FileSystemWritableFileStream = writable.into();
    JsFuture::from(writable_stream.write_with_u8_array(data)?).await?;
    JsFuture::from(writable_stream.close()).await?;
    Ok(())
  }
}

// ---->
// This is safe because wasm is currently single-threaded.
// It won't be safe when wasm becomes multi-threaded.
// Even if Rust allowed your program to compile, it would just create memory unsafety at runtime
// (which is why Rust is erroring: it's helping you to avoid memory unsafety!)
// https://github.com/rustwasm/wasm-bindgen/issues/1505
unsafe impl Send for WebFile {}
unsafe impl Sync for WebFile {}
unsafe impl Send for WebFileSystemAPI {}
unsafe impl Sync for WebFileSystemAPI {}
// <----

#[async_trait(?Send)]
impl CrossFile for WebFile {
  fn unlock(&self) -> Result<(), MinaError> {
    return Ok(());
  }

  fn lock_exclusive(&self) -> Result<(), MinaError> {
    return Ok(());
  }

  async fn get_buffer(&self) -> Box<dyn Read> {
    let file = JsFuture::from(self.file_handle.get_file())
      .await
      .unwrap()
      .dyn_into::<File>()
      .unwrap();
    let array_buffer = JsFuture::from(file.array_buffer()).await.unwrap();
    let uint8_array = Uint8Array::new(&array_buffer);
    let mut data = vec![0; uint8_array.length() as usize];
    uint8_array.copy_to(&mut data);
    return Box::new(Cursor::new(data));
  }

  async fn write_all(&mut self, data: &[u8]) -> Result<(), MinaError> {
    Ok(self.write_web_file(data).await?)
  }

  async fn read_as_string(&mut self) -> Result<String, MinaError> {
    let file = JsFuture::from(self.file_handle.get_file())
      .await
      .unwrap()
      .dyn_into::<File>()
      .unwrap();
    Ok(JsFuture::from(file.text()).await?.as_string().unwrap())
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
    create_dir_if_not_exist: bool,
    create_file_if_not_exist: bool,
  ) -> Result<WebFile, JsValue> {
    let dir_to_open;
    let mut handle;

    let iterator = dir_handle.entries();
    let async_iterator = AsyncIterator::from(iterator);

    dir_to_open = path_structure.directories.pop_front();
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
      handle = Some(pair.get(1));

      // Check if it's a file or directory handle
      if handle
        .as_ref()
        .unwrap()
        .is_instance_of::<FileSystemFileHandle>()
      {
        // console::log_2(&JsValue::from_str("File"), &JsValue::from(&name));
        if path_structure.file_name.is_some() && name.eq(path_structure.file_name.as_ref().unwrap())
        {
          // console::log_2(
          //     &JsValue::from_str("File found! Opening it!"),
          //     &JsValue::from(name),
          // );
          let file_handle = handle.unwrap().dyn_into::<FileSystemFileHandle>().unwrap();
          let file_result = JsFuture::from(file_handle.get_file()).await;
          if file_result.is_ok() {
            return Ok(WebFile { file_handle });
          } else {
            return Err(file_result.unwrap_err());
          }
        }
      } else if handle
        .as_ref()
        .unwrap()
        .is_instance_of::<FileSystemDirectoryHandle>()
      {
        // console::log_2(&JsValue::from_str("Directory"), &JsValue::from(&name));
        if let Some(dir_to_open) = &dir_to_open {
          if name.eq(dir_to_open) {
            // This directory is part of the path to open
            // console::log_2(&JsValue::from_str("Found"), &JsValue::from(&name));
            return Box::pin(
              self.open_web_file(
                &handle
                  .unwrap()
                  .dyn_into::<FileSystemDirectoryHandle>()
                  .unwrap(),
                path_structure,
                create_dir_if_not_exist,
                create_file_if_not_exist,
              ),
            )
            .await;
          }
        }
      }
    }

    // At this point the requested directory or file have not been found
    if dir_to_open.is_some() {
      // If dir_to_open is set at this point, it means the directory does not exist
      if create_dir_if_not_exist {
        // Create the directory by calling the get_directory_handle() function
        let options = FileSystemGetDirectoryOptions::new();
        options.set_create(true);
        handle = Some(
          JsFuture::from(
            dir_handle.get_directory_handle_with_options(&dir_to_open.unwrap(), &options),
          )
          .await?,
        );
        return Box::pin(
          self.open_web_file(
            &handle
              .unwrap()
              .dyn_into::<FileSystemDirectoryHandle>()
              .unwrap(),
            path_structure,
            create_dir_if_not_exist,
            create_file_if_not_exist,
          ),
        )
        .await;
      } else {
        Err(JsValue::from_str(DIRECTORY_DOES_NOT_EXIST))
      }
    } else {
      // If dir_to_open is not set at this point, it means the directory exists but the file does not exist
      if create_file_if_not_exist {
        if path_structure.file_name.is_some() {
          let options = FileSystemGetFileOptions::new();
          options.set_create(true);
          let file_handle = JsFuture::from(
            dir_handle
              .get_file_handle_with_options(&path_structure.file_name.as_ref().unwrap(), &options),
          )
          .await?
          .dyn_into::<FileSystemFileHandle>()
          .unwrap();
          let file_result = JsFuture::from(file_handle.get_file()).await;
          if file_result.is_ok() {
            return Ok(WebFile { file_handle });
          } else {
            return Err(file_result.unwrap_err());
          }
        } else {
          Err(JsValue::from_str(INVALID_PATH_ERROR_MSG))
        }
      } else {
        Err(JsValue::from_str(FILE_DOES_NOT_EXIST))
      }
    }
  }
}

impl FileSystemAPI for WebFileSystemAPI {
  async fn open(
    &self,
    _read: bool,
    _write: bool,
    _append: bool,
    _truncate: bool,
    path: &Path,
  ) -> Result<Box<dyn CrossFile>, MinaError> {
    if let Some(root_dir_handle) = &self.root_dir_handle {
      let mut path_structure = split_path_components(&path.to_str().unwrap());
      let result = self
        .open_web_file(root_dir_handle, &mut path_structure, false, false)
        .await?;
      return Ok(Box::new(result));
    } else {
      return Err(MinaError::new(IO_ERROR_CODE, MISSING_ROOT_DIR_HANDLE));
    }
  }

  async fn create(&self, path: &Path) -> Result<Box<dyn CrossFile>, MinaError> {
    if let Some(root_dir_handle) = &self.root_dir_handle {
      let mut path_structure = split_path_components(&path.to_str().unwrap());
      let result = self
        .open_web_file(root_dir_handle, &mut path_structure, false, true)
        .await?;
      return Ok(Box::new(result));
    } else {
      return Err(MinaError::new(IO_ERROR_CODE, MISSING_ROOT_DIR_HANDLE));
    }
  }
}
