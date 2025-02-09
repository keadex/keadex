use std::{
  collections::VecDeque,
  path::{Path, MAIN_SEPARATOR_STR},
};

pub struct PathStructure {
  pub directories: VecDeque<String>,
  pub file_name: Option<String>,
}

pub fn split_path_components(path: &str) -> PathStructure {
  let path = Path::new(path);

  // Get all components as strings
  let components: Vec<String> = path
    .iter()
    .map(|comp| comp.to_string_lossy().into_owned())
    .collect();

  // Separate directories and file name
  let mut file_name = None;
  if path.extension().is_some() {
    file_name = path.file_name().map(|f| f.to_string_lossy().into_owned());
  }
  let directories = components
    .iter()
    .take(components.len() - file_name.is_some() as usize)
    .filter(|dir| !dir.eq(&MAIN_SEPARATOR_STR))
    .cloned()
    .collect();

  return PathStructure {
    directories,
    file_name,
  };
}
