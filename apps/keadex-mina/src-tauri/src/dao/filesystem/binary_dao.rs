use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI as FsApiTrait;
use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::FileSystemAPI;
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::DAO;
use crate::error_handling::errors::{FILE_DOES_NOT_EXIST, IO_ERROR_CODE};
use crate::error_handling::mina_error::MinaError;
use crate::resolve_to_write;
use std::collections::HashMap;
use std::path::Path;

/**
Allows to read/write binary data from/to the file system.
*/
pub struct BinaryDAO {
  opened_files: HashMap<String, Box<dyn CrossFile>>,
}

impl Default for BinaryDAO {
  fn default() -> Self {
    BinaryDAO {
      opened_files: HashMap::new(),
    }
  }
}

impl DAO for BinaryDAO {}

impl FileSystemDAO<Vec<u8>> for BinaryDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, Box<dyn CrossFile>> {
    &mut self.opened_files
  }

  async fn get(&mut self, _path: &Path) -> Result<Vec<u8>, MinaError> {
    unimplemented!()
  }

  async fn save(
    &mut self,
    data: &Vec<u8>,
    path: &Path,
    create_if_not_exist: bool,
  ) -> Result<(), MinaError> {
    let store = ROOT_RESOLVER.get().read().await;
    if !resolve_to_write!(store, FileSystemAPI)
      .await
      .path_exists(Path::new(&path))
      .await?
    {
      if create_if_not_exist {
        let prefix = path.parent().unwrap();
        resolve_to_write!(store, FileSystemAPI)
          .await
          .create_dir_all(&Path::new(&prefix))
          .await?;
        resolve_to_write!(store, FileSystemAPI)
          .await
          .create(&Path::new(&path))
          .await?;
      } else {
        return Err(MinaError::new(IO_ERROR_CODE, FILE_DOES_NOT_EXIST));
      }
    }
    let file = self.open_and_unlock_file(path, false, true).await?;
    file.write_all(data).await?;
    Ok(())
  }

  async fn get_all(&mut self, _path: &Path) -> Result<Vec<Vec<u8>>, MinaError> {
    unimplemented!()
  }
}
