use crate::core::app::ROOT_RESOLVER;
// use crate::core::resolver::ResolvableModules::{NativeFileSystemAPI, WebFileSystemAPI};
use crate::resolve_to_read;
use std::io::Error;
use std::sync::RwLockReadGuard;

#[cfg(desktop)]
pub mod native_fs;
#[cfg(web)]
pub mod web_fs;

pub trait CrossFile {
  fn unlock(&mut self) -> Result<(), Error>;
  fn lock_exclusive(&mut self) -> Result<(), Error>;
}

pub trait FileSystemAPI: Default + Send + Sync {}

// /**
// Macro which allows to resolve a module with read-only permissions.
// # Arguments
//   * `store` - Store where is stored the module
//   * `module` - Module to resolve
// */
// pub fn filesystem_api() -> RwLockReadGuard<'static, Box<dyn FileSystemAPI>> {
//   let store = ROOT_RESOLVER.get().read().unwrap();
//   if cfg!(web) {
//     let prova = resolve_to_read!(store, WebFileSystemAPI).;
//     return resolve_to_read!(store, WebFileSystemAPI);
//   } else {
//     return resolve_to_read!(store, NativeFileSystemAPI);
//   }
// }
