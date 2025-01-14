use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI;
use fs2::FileExt;
use std::fs::File;
use std::io::Error;

// ----------- NativeFile
pub struct NativeFile {
  file: File,
}

impl NativeFile {
  pub fn new(&mut self, file: File) -> Self {
    Self { file }
  }
}
impl CrossFile for NativeFile {
  fn unlock(&mut self) -> Result<(), Error> {
    return self.file.unlock();
  }

  fn lock_exclusive(&mut self) -> Result<(), Error> {
    return self.file.lock_exclusive();
  }
}

// ----------- NativeFileSystemAPI
#[derive(Default)]
pub struct NativeFileSystemAPI {}
impl NativeFileSystemAPI {}
impl FileSystemAPI for NativeFileSystemAPI {}
