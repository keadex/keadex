use crate::api::filesystem::CrossFile;
use crate::api::filesystem::FileSystemAPI as FsApiTrait;
use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::FileSystemAPI;
use crate::core::serializer::{deserialize_plantuml_by_file, serialize_diagram_to_plantuml};
use crate::dao::filesystem::FileSystemDAO;
use crate::dao::DAO;
use crate::error_handling::errors::{FILE_DOES_NOT_EXIST, IO_ERROR_CODE};
use crate::error_handling::mina_error::MinaError;
use crate::model::diagram::diagram_plantuml::DiagramPlantUML;
use crate::resolve_to_write;
use std::collections::HashMap;
use std::path::Path;

pub const FILE_NAME: &str = "diagram.puml";

/**
Allows to read/write PlantUML diagrams from/to the file system.
*/
pub struct DiagramPlantUMLDAO {
  opened_files: HashMap<String, Box<dyn CrossFile>>,
}

impl Default for DiagramPlantUMLDAO {
  fn default() -> Self {
    DiagramPlantUMLDAO {
      opened_files: HashMap::new(),
    }
  }
}

impl DAO for DiagramPlantUMLDAO {}

impl FileSystemDAO<DiagramPlantUML> for DiagramPlantUMLDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, Box<dyn CrossFile>> {
    &mut self.opened_files
  }

  async fn get(&mut self, path: &Path) -> Result<DiagramPlantUML, MinaError> {
    let file = self.open_and_unlock_file(path, true, false).await?;
    let deserialized_plantuml = deserialize_plantuml_by_file(file).await?;
    let _ = self.lock_file(path);
    Ok(deserialized_plantuml)
  }

  async fn save(
    &mut self,
    data: &DiagramPlantUML,
    path: &Path,
    create_if_not_exist: bool,
  ) -> Result<(), MinaError>
  where
    Self: Send,
  {
    let store = ROOT_RESOLVER.get().read().await;
    if !resolve_to_write!(store, FileSystemAPI)
      .await
      .path_exists(&Path::new(&path))
      .await?
    {
      if create_if_not_exist {
        resolve_to_write!(store, FileSystemAPI)
          .await
          .create(&Path::new(&path))
          .await?;
      } else {
        return Err(MinaError::new(IO_ERROR_CODE, FILE_DOES_NOT_EXIST));
      }
    }
    let file = self.open_and_unlock_file(path, false, true).await?;
    let serialized_diagram = serialize_diagram_to_plantuml(data);
    file.write_all(serialized_diagram.as_bytes()).await?;
    let _ = self.lock_file(path);
    Ok(())
  }

  async fn get_all(&mut self, _path: &Path) -> Result<Vec<DiagramPlantUML>, MinaError> {
    todo!()
  }
}
