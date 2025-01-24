use std::path::Path;

pub struct PathStructure {
  pub directories: Vec<String>,
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
  let file_name = path.file_name().map(|f| f.to_string_lossy().into_owned());
  let directories = components
    .iter()
    .take(components.len() - file_name.is_some() as usize)
    .cloned()
    .collect();

  return PathStructure {
    directories,
    file_name,
  };
}
