use std::{future::Future, io::Error, io::Read};

#[cfg(desktop)]
pub mod native_fs;
#[cfg(web)]
pub mod web_fs;

pub trait CrossFile {
  fn unlock(&self) -> Result<(), Error>;
  fn lock_exclusive(&self) -> Result<(), Error>;
  fn get_buffer(&self) -> impl Future<Output = impl Read>;
}

pub trait FileSystemAPI {
  fn open(
    &self,
    read: bool,
    write: bool,
    append: bool,
    truncate: bool,
    path: &str,
  ) -> impl Future<Output = Result<impl CrossFile, Error>>;
}
