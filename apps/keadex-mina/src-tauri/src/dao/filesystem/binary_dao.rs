use crate::dao::filesystem::FileSystemDAO;
use crate::dao::DAO;
use crate::error_handling::errors::{FILE_DOES_NOT_EXIST, IO_ERROR_CODE};
use crate::error_handling::mina_error::MinaError;
use std::collections::HashMap;
use std::fs::{create_dir_all, File};
use std::io::Write;
use std::path::Path;

/**
Allows to read/write binary data from/to the file system.
*/
pub struct BinaryDAO {
  opened_files: HashMap<String, File>,
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
  fn get_opened_files(&mut self) -> &mut HashMap<String, File> {
    &mut self.opened_files
  }

  fn get(&mut self, path: &Path) -> Result<Vec<u8>, MinaError> {
    unimplemented!()
  }

  fn save(
    &mut self,
    data: &Vec<u8>,
    path: &Path,
    create_if_not_exist: bool,
  ) -> Result<(), MinaError> {
    if !Path::new(&path).exists() {
      if create_if_not_exist {
        let prefix = path.parent().unwrap();
        create_dir_all(prefix).unwrap();
        File::create(&path)?;
      } else {
        return Err(MinaError::new(IO_ERROR_CODE, FILE_DOES_NOT_EXIST));
      }
    }
    let mut file = self.open_and_unlock_file(path, false, true)?;
    file.write_all(data)?;
    Ok(())
  }

  fn get_all(&mut self, path: &Path) -> Result<Vec<Vec<u8>>, MinaError> {
    unimplemented!()
  }
}
