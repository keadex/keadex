use crate::error_handling::mina_error::MinaError;
use async_trait::async_trait;
use std::{future::Future, io::BufRead, path::Path, time::Duration};

#[cfg(desktop)]
pub mod native_fs;
#[cfg(web)]
pub mod web_fs;

pub struct CrossMetadata {
  /// Last modified duration since the Unix Epoch.
  pub last_modified: Option<Duration>,
  /// True if this metadata is for a directory.
  pub is_dir: bool,
}

#[derive(Debug, Clone)]
pub struct CrossPathBuf {
  pub file_name: String,
  pub path: Option<String>,
  pub is_dir: bool,
}

#[cfg_attr(desktop, async_trait)]
#[cfg_attr(web, async_trait(?Send))]
pub trait CrossFile: Send + Sync + std::fmt::Debug {
  fn unlock(&self) -> Result<(), MinaError>;
  fn lock_exclusive(&self) -> Result<(), MinaError>;
  async fn get_buffer(&self) -> Result<Box<dyn BufRead + Send>, MinaError>;
  async fn write_all(&mut self, buf: &[u8]) -> Result<(), MinaError>;
  async fn read_as_string(&mut self) -> Result<String, MinaError>;
  async fn metadata(&self) -> Result<CrossMetadata, MinaError>;
}

pub trait FileSystemAPI {
  fn open(
    &self,
    read: bool,
    write: bool,
    append: bool,
    truncate: bool,
    path: &Path,
  ) -> impl Future<Output = Result<Box<dyn CrossFile>, MinaError>>;
  fn create(&self, path: &Path) -> impl Future<Output = Result<Box<dyn CrossFile>, MinaError>>;
  fn create_dir_all(&self, path: &Path) -> impl Future<Output = Result<(), MinaError>>;
  fn remove_file(&self, path: &Path) -> impl Future<Output = Result<(), MinaError>>;
  fn remove_dir_all(&self, path: &Path) -> impl Future<Output = Result<(), MinaError>>;
  fn rename(&self, from: &Path, to: &Path) -> impl Future<Output = Result<(), MinaError>>;
  fn metadata(&self, path: &Path) -> impl Future<Output = Result<CrossMetadata, MinaError>>;
  fn read_dir(&self, path: &Path) -> impl Future<Output = Result<Vec<CrossPathBuf>, MinaError>>;
  fn path_exists(&self, path: &Path) -> impl Future<Output = Result<bool, MinaError>>;
  fn walk_dir<P>(
    &self,
    root: &Path,
    filter_entry_predicate: P,
  ) -> impl Future<Output = Result<Vec<CrossPathBuf>, MinaError>>
  where
    P: FnMut(&CrossPathBuf) -> bool + Clone;
}
