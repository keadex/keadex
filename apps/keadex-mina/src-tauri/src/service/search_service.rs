use crate::core::app::ROOT_RESOLVER;
use crate::core::project_initializer::load_project;
use crate::core::project_initializer::unload_project;
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::diagrams_path;
use crate::helper::library_helper::project_library_path;
use crate::model::file_search_results::FileSearchCategory;
use crate::model::file_search_results::{FileSearchResult, FileSearchResults};
use crate::resolve_to_write;
use std::collections::HashMap;
use std::fs::File;
use std::io::BufRead;
use std::io::BufReader;
use walkdir::DirEntry;
use walkdir::WalkDir;

/**
Generates the file search category of a file with the given path.
# Arguments
  * `path` - Path of the file to check.
  * `diagrams_dir` - Path of the diagrams directory.
  * `library_dir`- Path of the project library directory.
*/
fn get_category(path: &str, diagrams_dir: &str, library_dir: &str) -> FileSearchCategory {
  if path.starts_with(diagrams_dir) {
    return FileSearchCategory::Diagram;
  } else if path.starts_with(library_dir) {
    return FileSearchCategory::Library;
  } else {
    return FileSearchCategory::Unknown;
  }
}

/**
Checks if the given directory entry is searchable.
# Arguments
  * `entry` - Directory entry to check.
  * `include_diagrams_dir` - If you want to include the diagrams directory in the search.
  * `include_library_dir` - If you want to include the library directory in the search.
  * `diagrams_dir` - Path of the diagrams directory.
  * `library_dir`- Path of the project library directory.
*/
fn is_searchable_dir(
  entry: &DirEntry,
  root_dir: &str,
  include_diagrams_dir: bool,
  include_library_dir: bool,
  diagrams_dir: &str,
  library_dir: &str,
) -> bool {
  if let Some(path) = entry.path().to_str() {
    let is_searchable = path.eq(root_dir)
      || ((path.starts_with(diagrams_dir) || path.starts_with(library_dir))
        && (include_diagrams_dir || (!include_diagrams_dir && !path.starts_with(diagrams_dir)))
        && (include_library_dir || (!include_library_dir && !path.starts_with(library_dir))));
    return is_searchable;
  } else {
    return false;
  }
}

/**
Searches for the given string in the project's files.
# Arguments
  * `string` - String to search for.
  * `include_diagrams_dir` - If you want to include the diagrams directory in the search.
  * `include_library_dir` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
pub fn search(
  string_to_search: &str,
  include_diagrams_dir: bool,
  include_library_dir: bool,
  limit: i32,
) -> Result<FileSearchResults, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();

  let temp_root_1 = String::from(&project_settings.root);
  let temp_root_2 = String::from(&project_settings.root);

  let diagrams_directory = diagrams_path(&temp_root_2);
  let library_directory = project_library_path(&temp_root_2);

  let mut count = 0;
  let mut reached_limit = false;

  // Unload the project since we need to unlock all the project's file in order to read them
  unload_project(&project_settings.root)?;

  // Search for the given string in al the project's files
  let mut results = HashMap::new();
  for entry in WalkDir::new(temp_root_1)
    .into_iter()
    .filter_entry(|e| {
      is_searchable_dir(
        e,
        &temp_root_2,
        include_diagrams_dir,
        include_library_dir,
        &diagrams_directory,
        &library_directory,
      )
    })
    .filter_map(|e| e.ok())
  {
    if entry.file_type().is_file() {
      let file = File::options().read(true).write(false).open(entry.path())?;
      let reader = BufReader::new(file);
      let path = entry.path().to_str().unwrap();

      for (line_num, line) in reader.lines().enumerate() {
        if let Ok(line) = line {
          if line
            .to_lowercase()
            .contains(&string_to_search.to_lowercase())
          {
            count += 1;
            if count > limit {
              reached_limit = true;
              count -= 1;
              break;
            }
            results
              .entry(String::from(path))
              .or_insert(Vec::new())
              .push(FileSearchResult {
                line_content: String::from(line),
                line_number: line_num + 1,
                category: get_category(path, &diagrams_directory, &library_directory),
                path: String::from(path),
              });
          }
        } else {
          break;
        }
      }
    }

    if reached_limit {
      break;
    }
  }

  // (Re)load the project to make it available again to the client
  load_project(&temp_root_2)?;

  Ok(FileSearchResults {
    results,
    count,
    reached_limit,
  })
}
