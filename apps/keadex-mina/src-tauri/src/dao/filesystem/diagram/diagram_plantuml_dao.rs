#[cfg(feature = "desktop")]
use crate::core::serializer::{deserialize_plantuml_by_file, serialize_diagram_to_plantuml};
#[cfg(feature = "desktop")]
use crate::dao::filesystem::FileSystemDAO;
#[cfg(feature = "desktop")]
use crate::dao::DAO;
#[cfg(feature = "desktop")]
use crate::error_handling::errors::{FILE_DOES_NOT_EXIST, IO_ERROR_CODE};
#[cfg(feature = "desktop")]
use crate::error_handling::mina_error::MinaError;
#[cfg(feature = "desktop")]
use crate::model::diagram::diagram_plantuml::DiagramPlantUML;
#[cfg(feature = "desktop")]
use std::collections::HashMap;
#[cfg(feature = "desktop")]
use std::fs::File;
#[cfg(feature = "desktop")]
use std::io::Write;
#[cfg(feature = "desktop")]
use std::path::Path;

pub const FILE_NAME: &str = "diagram.puml";

/**
Allows to read/write PlantUML diagrams from/to the file system.
*/
#[cfg(feature = "desktop")]
pub struct DiagramPlantUMLDAO {
  opened_files: HashMap<String, File>,
}

#[cfg(feature = "desktop")]
impl Default for DiagramPlantUMLDAO {
  fn default() -> Self {
    DiagramPlantUMLDAO {
      opened_files: HashMap::new(),
    }
  }
}

#[cfg(feature = "desktop")]
impl DAO for DiagramPlantUMLDAO {}

#[cfg(feature = "desktop")]
impl FileSystemDAO<DiagramPlantUML> for DiagramPlantUMLDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, File> {
    &mut self.opened_files
  }

  fn get(&mut self, path: &Path) -> Result<DiagramPlantUML, MinaError> {
    let file = self.open_and_unlock_file(path, true, false)?;
    let deserialized_plantuml = deserialize_plantuml_by_file(file)?;
    self.lock_file(path);
    Ok(deserialized_plantuml)
  }

  fn save(
    &mut self,
    data: &DiagramPlantUML,
    path: &Path,
    create_if_not_exist: bool,
  ) -> Result<(), MinaError> {
    if !Path::new(&path).exists() {
      if create_if_not_exist {
        File::create(&path)?;
      } else {
        return Err(MinaError::new(IO_ERROR_CODE, FILE_DOES_NOT_EXIST));
      }
    }
    let mut file = self.open_and_unlock_file(path, false, true)?;
    let serialized_diagram = serialize_diagram_to_plantuml(data);
    file.write_all(serialized_diagram.as_bytes())?;
    self.lock_file(path);
    Ok(())
  }

  fn get_all(&mut self, path: &Path) -> Result<Vec<DiagramPlantUML>, MinaError> {
    todo!()
  }
}
