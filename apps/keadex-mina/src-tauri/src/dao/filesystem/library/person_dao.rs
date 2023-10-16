use crate::dao::filesystem::FileSystemDAO;
use crate::dao::DAO;
use crate::model::c4_element::person::Person;
use std::collections::HashMap;
use std::fs::File;

pub const FILE_NAME: &str = "persons.json";

/**
Allows to read/write Persons elements' data from/to the file system.
*/
pub struct PersonDAO {
  opened_files: HashMap<String, File>,
}

impl Default for PersonDAO {
  fn default() -> Self {
    PersonDAO {
      opened_files: HashMap::new(),
    }
  }
}

impl DAO for PersonDAO {}

impl FileSystemDAO<Person> for PersonDAO {
  fn get_opened_files(&mut self) -> &mut HashMap<String, File> {
    &mut self.opened_files
  }
}
