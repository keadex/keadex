use crate::api::filesystem::CrossFile;
use crate::api::filesystem::CrossMetadata;
use crate::api::filesystem::CrossPathBuf;
use crate::api::filesystem::FileSystemAPI;
use crate::error_handling::mina_error::MinaError;
use async_trait::async_trait;
use fs2::FileExt;
use std::fs::File;
use std::fs::Metadata;
use std::fs::OpenOptions;
use std::io::BufRead;
use std::io::BufReader;
use std::io::Read;
use std::io::Write;
use std::path::Path;
use std::time::UNIX_EPOCH;
use walkdir::WalkDir;

impl From<&walkdir::DirEntry> for CrossPathBuf {
  fn from(dir_entry: &walkdir::DirEntry) -> CrossPathBuf {
    let path = dir_entry.path();
    CrossPathBuf {
      is_dir: dir_entry.file_type().is_dir(),
      path: Some(String::from(path.to_str().unwrap())),
      file_name: String::from(path.file_name().unwrap().to_str().unwrap()),
    }
  }
}

impl From<&Metadata> for CrossMetadata {
  fn from(metadata: &Metadata) -> CrossMetadata {
    let is_dir = metadata.is_dir();
    let mut last_modified = None;
    if let Ok(last_modified_metadata) = metadata.modified() {
      last_modified = Some(last_modified_metadata.duration_since(UNIX_EPOCH).unwrap());
    }
    CrossMetadata {
      is_dir,
      last_modified,
    }
  }
}

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
    // Disable file lock/unlock feature also on native. This complicates the business logic
    // without a good benefit-cost ratio. Moreover, the current lock/unlock logic
    // contains some bugs.
    // TODO - For now, I'm just commenting this code. If it will be acceptable without
    // the file lock/unlock feature, I'll remove the entire logic.
    // match self.file.unlock() {
    //   Ok(ok) => Ok(ok),
    //   Err(err) => Err(MinaError::from(err)),
    // }
    return Ok(());
  }

  fn lock_exclusive(&self) -> Result<(), MinaError> {
    // Disable file lock/unlock feature also on native. This complicates the business logic
    // without a good benefit-cost ratio. Moreover, the current lock/unlock logic
    // contains some bugs.
    // TODO - For now, I'm just commenting this code. If it will be acceptable without
    // the file lock/unlock feature, I'll remove the entire logic.
    // match self.file.lock_exclusive() {
    //   Ok(ok) => Ok(ok),
    //   Err(err) => Err(MinaError::from(err)),
    // }
    return Ok(());
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
    return Ok(CrossMetadata::from(&metadata));
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
    let metadata_result = path.metadata();
    if metadata_result.is_ok() {
      let metadata = metadata_result.unwrap();
      return Ok(CrossMetadata::from(&metadata));
    }
    return Err(metadata_result.unwrap_err().into());
  }

  async fn read_dir(&self, path: &Path) -> Result<Vec<CrossPathBuf>, MinaError> {
    let mut paths = vec![];
    if let Ok(dir_paths) = std::fs::read_dir(path) {
      for dir_path in dir_paths {
        let path = dir_path.unwrap().path();
        paths.push(CrossPathBuf {
          is_dir: path.is_dir(),
          path: Some(String::from(path.to_str().unwrap())),
          file_name: String::from(path.file_name().unwrap().to_str().unwrap()),
        });
      }
    }
    return Ok(paths);
  }

  async fn walk_dir<P>(
    &self,
    raw_path: &Path,
    mut filter_entry_predicate: P,
  ) -> Result<Vec<CrossPathBuf>, MinaError>
  where
    P: FnMut(&CrossPathBuf) -> bool + Clone,
  {
    let entries: Vec<CrossPathBuf> = WalkDir::new(raw_path.to_str().unwrap())
      .into_iter()
      .filter_entry(|e| filter_entry_predicate(&CrossPathBuf::from(e)))
      .filter_map(|e| {
        if let Some(dir_entry) = e.ok() {
          return Some(CrossPathBuf::from(&dir_entry));
        }
        None::<CrossPathBuf>
      })
      .collect();
    return Ok(entries);
    // // Adjust the input path since this function expects a path starting with a MAIN_SEPARATOR
    // let path_str = format!("{}{}", MAIN_SEPARATOR, raw_path.to_str().unwrap());
    // let mut path = raw_path;
    // if !raw_path.to_str().unwrap().starts_with(MAIN_SEPARATOR_STR) {
    //   path = Path::new(&path_str);
    // }

    // if let Some(root_dir_handle) = &self.root_dir_handle {
    //   self
    //     .read_dir_web(&root_dir_handle, path, path, true, filter_entry_predicate)
    //     .await
    // } else {
    //   return Err(MinaError::new(IO_ERROR_CODE, MISSING_ROOT_DIR_HANDLE));
    // }
  }

  async fn path_exists(&self, path: &Path) -> Result<bool, MinaError> {
    Ok(path.exists())
  }
}
