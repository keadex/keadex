use crate::error_handling::mina_error::MinaError;
use async_trait::async_trait;
use std::{future::Future, io::Read, path::Path};

#[cfg(desktop)]
pub mod native_fs;
#[cfg(web)]
pub mod web_fs;

#[cfg_attr(desktop, async_trait)]
#[cfg_attr(web, async_trait(?Send))]
pub trait CrossFile: Send + Sync {
  fn unlock(&self) -> Result<(), MinaError>;
  fn lock_exclusive(&self) -> Result<(), MinaError>;
  async fn get_buffer(&self) -> Box<dyn Read>;
  async fn write_all(&mut self, buf: &[u8]) -> Result<(), MinaError>;
  async fn read_as_string(&mut self) -> Result<String, MinaError>;
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
}
