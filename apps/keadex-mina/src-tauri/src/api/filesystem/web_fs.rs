use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI;
use std::io::Error;
use web_sys::File;

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
pub struct WebFileSystemAPI {}
impl WebFileSystemAPI {}
impl FileSystemAPI for WebFileSystemAPI {}
