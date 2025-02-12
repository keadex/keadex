use crate::api::filesystem::CrossFile;
use crate::api::filesystem::CrossMetadata;
use crate::api::filesystem::CrossPathBuf;
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
use js_sys::Uint8Array;
use std::io::BufRead;
use std::io::Cursor;
use std::path::Path;
use std::time::Duration;
use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::JsFuture;
use web_sys::FileSystemFileHandle;
use web_sys::FileSystemGetDirectoryOptions;
use web_sys::FileSystemGetFileOptions;
use web_sys::FileSystemHandleKind;
use web_sys::FileSystemRemoveOptions;
use web_sys::FileSystemWritableFileStream;
use web_sys::{File, FileSystemDirectoryHandle};

// ----------- WebFile
#[derive(Debug)]
pub struct WebFile {
  pub file_handle: Option<FileSystemFileHandle>,
  pub dir_handle: Option<FileSystemDirectoryHandle>,
  pub parent_dir_handle: FileSystemDirectoryHandle,
}

impl WebFile {
  pub fn new(
    file_handle: Option<FileSystemFileHandle>,
    dir_handle: Option<FileSystemDirectoryHandle>,
    parent_dir_handle: FileSystemDirectoryHandle,
  ) -> Self {
    Self {
      file_handle,
      dir_handle,
      parent_dir_handle,
    }
  }

  async fn write_web_file(&mut self, data: &[u8]) -> Result<(), JsValue> {
    let writable = JsFuture::from(self.file_handle.as_ref().unwrap().create_writable()).await?;
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

  async fn get_buffer(&self) -> Box<dyn BufRead + Send> {
    let file = JsFuture::from(self.file_handle.as_ref().unwrap().get_file())
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
    let file = JsFuture::from(self.file_handle.as_ref().unwrap().get_file())
      .await
      .unwrap()
      .dyn_into::<File>()
      .unwrap();
    Ok(JsFuture::from(file.text()).await?.as_string().unwrap())
  }

  async fn metadata(&self) -> Result<CrossMetadata, MinaError> {
    let file = JsFuture::from(self.file_handle.as_ref().unwrap().get_file())
      .await?
      .dyn_into::<File>()
      .unwrap();
    let is_dir = self.dir_handle.is_some() && self.file_handle.is_none();
    let last_modified = Some(Duration::from_millis(file.last_modified() as u64));
    return Ok(CrossMetadata {
      is_dir,
      last_modified,
    });
  }
}

// ----------- WebFileSystemAPI
#[derive(Default)]
pub struct WebFileSystemAPI {
  pub root_dir_handle: Option<FileSystemDirectoryHandle>,
}

impl WebFileSystemAPI {
  pub async fn open_web_fs_entry(
    &self,
    parent_dir_handle: &FileSystemDirectoryHandle,
    dir_handle: &FileSystemDirectoryHandle,
    path_structure: &mut PathStructure,
    entry_type: FileSystemHandleKind,
    create_dir_if_not_exist: bool,
    create_file_if_not_exist: bool,
  ) -> Result<WebFile, JsValue> {
    let dir_to_open;
    let mut handle;

    let async_iterator = dir_handle.entries();

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

      if dir_to_open.is_none()
        && handle
          .as_ref()
          .unwrap()
          .is_instance_of::<FileSystemFileHandle>()
      {
        // I can check if the current file is the requested one only if I completed to read
        // all the directories in the path
        if path_structure.file_name.is_some() && name.eq(path_structure.file_name.as_ref().unwrap())
        {
          let file_handle = handle.unwrap().dyn_into::<FileSystemFileHandle>().unwrap();
          let file_result = JsFuture::from(file_handle.get_file()).await;
          if file_result.is_ok() {
            return Ok(WebFile::new(Some(file_handle), None, dir_handle.clone()));
          } else {
            return Err(file_result.unwrap_err());
          }
        }
      } else if dir_to_open.is_some()
        && handle
          .as_ref()
          .unwrap()
          .is_instance_of::<FileSystemDirectoryHandle>()
      {
        // Check if the current directory is part of the path to open
        if name.eq(dir_to_open.as_ref().unwrap()) {
          return Box::pin(
            self.open_web_fs_entry(
              &dir_handle,
              &handle
                .unwrap()
                .dyn_into::<FileSystemDirectoryHandle>()
                .unwrap(),
              path_structure,
              entry_type,
              create_dir_if_not_exist,
              create_file_if_not_exist,
            ),
          )
          .await;
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
          self.open_web_fs_entry(
            &dir_handle,
            &handle
              .unwrap()
              .dyn_into::<FileSystemDirectoryHandle>()
              .unwrap(),
            path_structure,
            entry_type,
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
      if entry_type == FileSystemHandleKind::File {
        if path_structure.file_name.is_some() {
          if create_file_if_not_exist {
            let options = FileSystemGetFileOptions::new();
            options.set_create(true);
            let file_handle =
              JsFuture::from(dir_handle.get_file_handle_with_options(
                &path_structure.file_name.as_ref().unwrap(),
                &options,
              ))
              .await?
              .dyn_into::<FileSystemFileHandle>()
              .unwrap();
            let file_result = JsFuture::from(file_handle.get_file()).await;
            if file_result.is_ok() {
              return Ok(WebFile::new(Some(file_handle), None, dir_handle.clone()));
            } else {
              return Err(file_result.unwrap_err());
            }
          } else {
            Err(JsValue::from_str(FILE_DOES_NOT_EXIST))
          }
        } else {
          Err(JsValue::from_str(INVALID_PATH_ERROR_MSG))
        }
      } else {
        Ok(WebFile::new(
          None,
          Some(dir_handle.clone()),
          parent_dir_handle.clone(),
        ))
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
        .open_web_fs_entry(
          root_dir_handle,
          root_dir_handle,
          &mut path_structure,
          FileSystemHandleKind::File,
          false,
          false,
        )
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
        .open_web_fs_entry(
          root_dir_handle,
          root_dir_handle,
          &mut path_structure,
          FileSystemHandleKind::File,
          false,
          true,
        )
        .await?;
      return Ok(Box::new(result));
    } else {
      return Err(MinaError::new(IO_ERROR_CODE, MISSING_ROOT_DIR_HANDLE));
    }
  }

  async fn create_dir_all(&self, path: &Path) -> Result<(), MinaError> {
    if let Some(root_dir_handle) = &self.root_dir_handle {
      let mut path_structure = split_path_components(&path.to_str().unwrap());
      self
        .open_web_fs_entry(
          root_dir_handle,
          root_dir_handle,
          &mut path_structure,
          FileSystemHandleKind::Directory,
          true,
          false,
        )
        .await?;
      return Ok(());
    } else {
      return Err(MinaError::new(IO_ERROR_CODE, MISSING_ROOT_DIR_HANDLE));
    }
  }

  async fn remove_file(&self, path: &Path) -> Result<(), MinaError> {
    if let Some(root_dir_handle) = &self.root_dir_handle {
      let mut path_structure = split_path_components(&path.to_str().unwrap());
      let file = self
        .open_web_fs_entry(
          root_dir_handle,
          root_dir_handle,
          &mut path_structure,
          FileSystemHandleKind::File,
          false,
          false,
        )
        .await?;
      JsFuture::from(
        file
          .parent_dir_handle
          .remove_entry(&file.file_handle.unwrap().name()),
      )
      .await?;
      return Ok(());
    } else {
      return Err(MinaError::new(IO_ERROR_CODE, MISSING_ROOT_DIR_HANDLE));
    }
  }

  async fn remove_dir_all(&self, path: &Path) -> Result<(), MinaError> {
    if let Some(root_dir_handle) = &self.root_dir_handle {
      let mut path_structure = split_path_components(&path.to_str().unwrap());
      let result = self
        .open_web_fs_entry(
          root_dir_handle,
          root_dir_handle,
          &mut path_structure,
          FileSystemHandleKind::Directory,
          false,
          false,
        )
        .await?;
      let options = FileSystemRemoveOptions::new();
      options.set_recursive(true);
      JsFuture::from(
        result
          .parent_dir_handle
          .remove_entry_with_options(&result.dir_handle.unwrap().name(), &options),
      )
      .await?;
      Ok(())
    } else {
      return Err(MinaError::new(IO_ERROR_CODE, MISSING_ROOT_DIR_HANDLE));
    }
  }

  async fn rename(&self, from: &Path, to: &Path) -> Result<(), MinaError> {
    if let Some(root_dir_handle) = &self.root_dir_handle {
      let mut file_from = self
        .open_web_fs_entry(
          root_dir_handle,
          root_dir_handle,
          &mut split_path_components(&from.to_str().unwrap()),
          FileSystemHandleKind::File,
          false,
          false,
        )
        .await?;
      let mut file_to = self
        .open_web_fs_entry(
          root_dir_handle,
          root_dir_handle,
          &mut split_path_components(&to.to_str().unwrap()),
          FileSystemHandleKind::File,
          true,
          true,
        )
        .await?;
      file_to
        .write_all(file_from.read_as_string().await?.as_bytes())
        .await?;
      self.remove_file(from).await?;
      Ok(())
    } else {
      return Err(MinaError::new(IO_ERROR_CODE, MISSING_ROOT_DIR_HANDLE));
    }
  }

  async fn metadata(&self, path: &Path) -> Result<CrossMetadata, MinaError> {
    let file = self.open(true, false, false, false, path).await?;
    file.metadata().await
  }

  async fn read_dir(&self, path: &Path) -> Result<Vec<CrossPathBuf>, MinaError> {
    if let Some(root_dir_handle) = &self.root_dir_handle {
      let mut path_structure = split_path_components(&path.to_str().unwrap());
      if path_structure.file_name.is_none() {
        let dir = self
          .open_web_fs_entry(
            &root_dir_handle,
            &root_dir_handle,
            &mut path_structure,
            FileSystemHandleKind::Directory,
            false,
            false,
          )
          .await?;

        let mut paths = vec![];
        let mut handle;

        let async_iterator = dir.dir_handle.unwrap().entries();
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

          if handle
            .as_ref()
            .unwrap()
            .is_instance_of::<FileSystemFileHandle>()
          {
            paths.push(CrossPathBuf {
              file_name: name,
              is_dir: false,
            });
          } else if handle
            .as_ref()
            .unwrap()
            .is_instance_of::<FileSystemDirectoryHandle>()
          {
            paths.push(CrossPathBuf {
              file_name: name,
              is_dir: true,
            });
          }
        }
        return Ok(paths);
      } else {
        return Err(MinaError::new(IO_ERROR_CODE, INVALID_PATH_ERROR_MSG));
      }
    } else {
      return Err(MinaError::new(IO_ERROR_CODE, MISSING_ROOT_DIR_HANDLE));
    }
  }
}
