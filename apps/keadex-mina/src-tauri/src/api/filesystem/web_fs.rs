use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI;
use crate::error_handling::errors::MISSING_ROOT_DIR_HANDLE;
use crate::helper::fs_helper::split_path_components;
use std::io::Error;
use wasm_bindgen::JsValue;
use web_sys::{File, FileSystemDirectoryHandle};

// ----------- WebFile
pub struct WebFile {
  file: File,
}

impl WebFile {
  pub fn new(&mut self, file: File) -> Self {
    Self { file }
  }
}
impl CrossFile for WebFile {
  fn unlock(&mut self) -> Result<(), Error> {
    return Ok(());
  }

  fn lock_exclusive(&mut self) -> Result<(), Error> {
    return Ok(());
  }
}

// ----------- WebFileSystemAPI
#[derive(Default)]
pub struct WebFileSystemAPI {
  pub root_dir_handle: Option<FileSystemDirectoryHandle>,
}
impl WebFileSystemAPI {
  fn open_from_path(&mut self, path: &str) -> Result<impl CrossFile, Error> {
    if let Some(root_dir_handle) = self.root_dir_handle {
      let path_structure = split_path_components(path);
      let result = futures::executors::block_on(root_dir_handle.entries());
      Ok(WebFile {
        file: File::new_with_str_sequence(&JsValue::from_str("s"), "ciao"),
      })
    } else {
      return Err(Error::new(
        std::io::ErrorKind::Other,
        MISSING_ROOT_DIR_HANDLE,
      ));
    }
  }
}

impl FileSystemAPI for WebFileSystemAPI {
  fn open(
    &mut self,
    read: bool,
    write: bool,
    append: bool,
    truncate: bool,
    path: &str,
  ) -> Result<impl CrossFile, Error> {
    // let file_result = OpenOptions::new()
    //   .read(read)
    //   .write(write)
    //   .append(append)
    //   .truncate(truncate)
    //   .open(path);
    // match file_result {
    //   Ok(file) => return Ok(NativeFile { file }),
    //   Err(error) => return Err(error),
    // }
  }
}
