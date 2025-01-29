use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI;
use fs2::FileExt;
use std::fs::File;
use std::fs::OpenOptions;
use std::io::BufReader;
use std::io::Error;

// ----------- NativeFile
#[derive(Debug)]
pub struct NativeFile {
  file: File,
}

impl NativeFile {
  pub fn new(&mut self, file: File) -> Self {
    Self { file }
  }
}
impl CrossFile for NativeFile {
  fn unlock(&self) -> Result<(), Error> {
    return self.file.unlock();
  }

  fn lock_exclusive(&self) -> Result<(), Error> {
    return self.file.lock_exclusive();
  }

  async fn get_buffer(&self) -> impl std::io::Read {
    return BufReader::new(&self.file);
  }
}

// ----------- NativeFileSystemAPI
#[derive(Default)]
pub struct NativeFileSystemAPI {}
impl NativeFileSystemAPI {}

impl FileSystemAPI for NativeFileSystemAPI {
  async fn open(
    &self,
    read: bool,
    write: bool,
    append: bool,
    truncate: bool,
    path: &str,
  ) -> Result<impl CrossFile, Error> {
    let file_result = OpenOptions::new()
      .read(read)
      .write(write)
      .append(append)
      .truncate(truncate)
      .open(path);
    match file_result {
      Ok(file) => return Ok(NativeFile { file }),
      Err(error) => return Err(error),
    }
  }
}
