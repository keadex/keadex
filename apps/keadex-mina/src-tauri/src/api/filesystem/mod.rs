use std::io::Error;

#[cfg(desktop)]
pub mod native_fs;
#[cfg(web)]
pub mod web_fs;

pub trait CrossFile {
  fn unlock(&mut self) -> Result<(), Error>;
  fn lock_exclusive(&mut self) -> Result<(), Error>;
}

pub trait FileSystemAPI {
  fn open(
    &mut self,
    read: bool,
    write: bool,
    append: bool,
    truncate: bool,
    path: &str,
  ) -> impl std::future::Future<Output = Result<impl CrossFile, Error>> + Send
  where
    Self: std::marker::Send;
}
