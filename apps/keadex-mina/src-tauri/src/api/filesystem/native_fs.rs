use crate::api::filesystem::CrossFile;
use crate::api::filesystem::CrossMetadata;
use crate::api::filesystem::FileSystemAPI;
use crate::error_handling::mina_error::MinaError;
use async_trait::async_trait;
use fs2::FileExt;
use std::fs::File;
use std::fs::OpenOptions;
use std::io::BufRead;
use std::io::BufReader;
use std::io::Read;
use std::io::Write;
use std::path::Path;
use std::time::UNIX_EPOCH;

use super::CrossPathBuf;

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

#[async_trait]
impl CrossFile for NativeFile {
  fn unlock(&self) -> Result<(), MinaError> {
    match self.file.unlock() {
      Ok(ok) => Ok(ok),
      Err(err) => Err(MinaError::from(err)),
    }
  }

  fn lock_exclusive(&self) -> Result<(), MinaError> {
    match self.file.lock_exclusive() {
      Ok(ok) => Ok(ok),
      Err(err) => Err(MinaError::from(err)),
    }
  }

  async fn get_buffer(&self) -> Result<Box<dyn BufRead + Send>, MinaError> {
    let buf_reader = BufReader::new(self.file.try_clone()?);
    return Ok(Box::new(buf_reader));
  }

  async fn write_all(&mut self, buf: &[u8]) -> Result<(), MinaError> {
    match self.file.write_all(buf) {
      Ok(ok) => Ok(ok),
      Err(err) => Err(MinaError::from(err)),
    }
  }

  async fn read_as_string(&mut self) -> Result<String, MinaError> {
    let mut content = String::new();
    self.file.read_to_string(&mut content)?;
    return Ok(content);
  }

  async fn metadata(&self) -> Result<CrossMetadata, MinaError> {
    let metadata = self.file.metadata()?;
    let is_dir = metadata.is_dir();
    let mut last_modified = None;
    if let Ok(last_modified_metadata) = metadata.modified() {
      last_modified = Some(last_modified_metadata.duration_since(UNIX_EPOCH).unwrap());
    }

    return Ok(CrossMetadata {
      is_dir,
      last_modified,
    });
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
    path: &Path,
  ) -> Result<Box<dyn CrossFile>, MinaError> {
    let file_result = OpenOptions::new()
      .read(read)
      .write(write)
      .append(append)
      .truncate(truncate)
      .open(path);
    match file_result {
      Ok(file) => return Ok(Box::new(NativeFile { file })),
      Err(error) => return Err(MinaError::from(error)),
    }
  }

  async fn create(&self, path: &Path) -> Result<Box<dyn CrossFile>, MinaError> {
    let file = File::create(&path)?;
    return Ok(Box::new(NativeFile { file }));
  }

  async fn create_dir_all(&self, path: &Path) -> Result<(), MinaError> {
    let result = std::fs::create_dir_all(path)?;
    return Ok(result);
  }

  async fn remove_file(&self, path: &Path) -> Result<(), MinaError> {
    let result = std::fs::remove_file(path)?;
    return Ok(result);
  }

  async fn remove_dir_all(&self, path: &Path) -> Result<(), MinaError> {
    let result = std::fs::remove_dir_all(path)?;
    return Ok(result);
  }

  async fn rename(&self, from: &Path, to: &Path) -> Result<(), MinaError> {
    let result = std::fs::rename(from, to)?;
    return Ok(result);
  }

  async fn metadata(&self, path: &Path) -> Result<CrossMetadata, MinaError> {
    let file = self.open(true, false, false, false, path).await?;
    file.metadata().await
  }

  async fn read_dir(&self, path: &Path) -> Result<Vec<CrossPathBuf>, MinaError> {
    let mut paths = vec![];
    if let Ok(dir_paths) = std::fs::read_dir(path) {
      for dir_path in dir_paths {
        let path = dir_path.unwrap().path();
        paths.push(CrossPathBuf {
          is_dir: path.is_dir(),
          file_name: String::from(path.file_name().unwrap().to_str().unwrap()),
        });
      }
    }
    return Ok(paths);
  }

  async fn path_exists(&self, path: &Path) -> Result<bool, MinaError> {
    Ok(path.exists())
  }
}
