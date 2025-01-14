use std::io::Error;

#[cfg(desktop)]
pub mod native_fs;
#[cfg(web)]
pub mod web_fs;

pub trait CrossFile {
  fn unlock(&mut self) -> Result<(), Error>;
  fn lock_exclusive(&mut self) -> Result<(), Error>;
}

pub trait FileSystemAPI {}
