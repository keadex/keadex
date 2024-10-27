use crate::core::app::ROOT_RESOLVER;
use crate::core::project_initializer::load_project;
use crate::core::project_initializer::unload_project;
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::helper::diagram_helper::clean_plantuml_diagram_element;
use crate::helper::diagram_helper::diagrams_path;
use crate::helper::library_helper::path_from_element_type;
use crate::helper::library_helper::project_library_path;
use crate::helper::search_helper::create_search_diagram_elem_in_plantuml_regex;
use crate::model::diagram::diagram_plantuml::serialize_elements_to_plantuml;
use crate::model::diagram_element_search_results::DiagramElementSearchResult;
use crate::model::diagram_element_search_results::DiagramElementSearchResults;
use crate::model::file_search_results::FileSearchCategory;
use crate::model::file_search_results::{FileSearchResult, FileSearchResults};
use crate::repository::library::library_repository::search_library_element;
use crate::resolve_to_write;
use std::collections::HashMap;
use std::fs::rename;
use std::fs::File;
use std::io::BufRead;
use std::io::BufReader;
use std::io::Write;
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
Searches by using the given callback in the project's files.
# Arguments
  * `predicate` - Callback invoked with the current line, current line number, current path, diagrams directory and library directory. Returns true if the line matches the condition, false otherwise.
  * `include_diagrams` - If you want to include the diagrams directory in the search.
  * `include_library` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
pub fn search_in_project<F: FnMut(String, usize, &str, &str, &str) -> Result<bool, MinaError>>(
  mut predicate: F,
  include_diagrams: bool,
  include_library: bool,
  limit: i32,
) -> Result<bool, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO).get();

  if let Some(project_settings) = project_settings {
    let temp_root_1 = String::from(&project_settings.root);
    let temp_root_2 = String::from(&project_settings.root);

    let diagrams_directory = diagrams_path(&temp_root_2);
    let library_directory = project_library_path(&temp_root_2);

    let mut count = 0;
    let mut reached_limit = false;

    // Unload the project since we need to unlock all the project's file in order to read them
    unload_project(&project_settings.root)?;

    // Search for the given string in all the project's files
    for entry in WalkDir::new(temp_root_1)
      .into_iter()
      .filter_entry(|e| {
        is_searchable_dir(
          e,
          &temp_root_2,
          include_diagrams,
          include_library,
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
            if predicate(
              line,
              line_num,
              path,
              &diagrams_directory,
              &library_directory,
            )? {
              count += 1;
              if count > limit {
                reached_limit = true;
                count -= 1;
                break;
              }
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

    Ok(reached_limit)
  } else {
    Ok(true)
  }
}

/**
Searches for the given text in the project's files and replace it with the given text.
# Arguments
  * `text_to_search` - Text to search for.
  * `replacement` - Replacement.
  * `include_diagrams` - If you want to include the diagrams directory in the search.
  * `include_library` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
pub fn search_and_replace_text(
  text_to_search: &str,
  replacement: &str,
  include_diagrams: bool,
  include_library: bool,
  limit: i32,
) -> Result<FileSearchResults, MinaError> {
  log::debug!("Search {} and replace with {}", text_to_search, replacement);

  let mut current_path = String::from("");
  let mut temp_file_opt = None;
  let mut new_line = String::from("");

  let mut results = HashMap::new();
  let reached_limit = search_in_project(
    |line, line_num, path, diagrams_directory, library_directory| {
      if !path.eq(&current_path) {
        if !current_path.eq("") {
          rename(format!("{}.tmp", current_path), &current_path)?;
        }
        current_path = path.to_string();
        temp_file_opt = Some(File::create(format!("{}.tmp", path))?);
      }

      let mut is_found = Ok(false);
      if let Some(temp_file) = temp_file_opt.as_mut() {
        if line.eq(&text_to_search) {
          new_line = replacement.to_string();
          is_found = Ok(true);

          results
            .entry(String::from(path))
            .or_insert(Vec::new())
            .push(FileSearchResult {
              line_content: String::from(line),
              line_number: line_num + 1,
              category: get_category(path, &diagrams_directory, &library_directory),
              path: String::from(path),
            });
        } else {
          new_line = line;
          is_found = Ok(false)
        }
        writeln!(temp_file, "{}", new_line)?;
        return is_found;
      }
      return is_found;
    },
    include_diagrams,
    include_library,
    limit,
  )?;

  if !current_path.eq("") {
    rename(format!("{}.tmp", current_path), &current_path)?;
  }

  let count = results.len().try_into().unwrap();
  Ok(FileSearchResults {
    results,
    count,
    reached_limit,
  })
}

/**
Searches for the given text in the project's files.
# Arguments
  * `text_to_search` - Text to search for.
  * `include_diagrams` - If you want to include the diagrams directory in the search.
  * `include_library` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
pub fn search_text(
  text_to_search: &str,
  include_diagrams: bool,
  include_library: bool,
  limit: i32,
) -> Result<FileSearchResults, MinaError> {
  let mut results = HashMap::new();
  let reached_limit = search_in_project(
    |line, line_num, path, diagrams_directory, library_directory| {
      if line.to_lowercase().contains(&text_to_search.to_lowercase()) {
        results
          .entry(String::from(path))
          .or_insert(Vec::new())
          .push(FileSearchResult {
            line_content: String::from(line),
            line_number: line_num + 1,
            category: get_category(path, &diagrams_directory, &library_directory),
            path: String::from(path),
          });
        return Ok(true);
      }
      return Ok(false);
    },
    include_diagrams,
    include_library,
    limit,
  )?;

  let count = results.len().try_into().unwrap();
  Ok(FileSearchResults {
    results,
    count,
    reached_limit,
  })
}

/**
Searches for the given diagram element in the project's files.
# Arguments
  * `alias` - Alias of the diagram element to search for.
  * `plantuml_diagram_element` - PlantUML of the diagram element to search for.
  * `include_diagrams_dir` - If you want to include the diagrams directory in the search.
  * `include_library_dir` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
pub fn search_diagram_element(
  alias: &str,
  plantuml_diagram_element: &str,
  include_diagrams: bool,
  include_library: bool,
  limit: i32,
) -> Result<DiagramElementSearchResults, MinaError> {
  // clean the plantuml
  let cleaned_plantuml_diagram_element = clean_plantuml_diagram_element(plantuml_diagram_element)?;

  let re_diagrams_dir = create_search_diagram_elem_in_plantuml_regex(alias);

  let mut results = HashMap::new();
  let mut reached_limit = false;

  // SEARCH IN DIAGRAMS
  if include_diagrams {
    reached_limit = search_in_project(
      |line, _line_num, path, diagrams_directory, library_directory| {
        // clean the line
        let cleaned_line = clean_plantuml_diagram_element(&line)?;

        let category = get_category(path, diagrams_directory, library_directory);

        let result = re_diagrams_dir.is_match(&cleaned_line);
        if result.is_ok() {
          let did_match = result.unwrap();
          if did_match {
            let mut result = DiagramElementSearchResult {
              category,
              path: String::from(path),
              partial_match: true,
            };

            // The line matches the regex, which means that it is a valid diagram element with the alias to find.
            // So check if the line (PlantUML) matches exactly the PlantUML of the diagram to find.
            // If it does not match, this means the alias has been used for another diagram element, which is prohibited.

            // In theory, you should check if the two strings are equal. But by doing so, elements
            // with nested elements will be excluded:
            //    - cleaned_plantuml_diagram_element:
            //        "System_Boundary(boundary, "boundary") {
            //
            //         }"
            //    - cleaned_line:
            //        "System_Boundary(boundary, "boundary") {"
            //    - cleaned_plantuml_diagram_element !== cleaned_line
            //
            // By using the "starts with" condition you cover also this case.
            //    - cleaned_plantuml_diagram_element starts with cleaned_line
            if cleaned_plantuml_diagram_element.starts_with(&cleaned_line) {
              result.partial_match = false
            }

            results
              .entry(String::from(path))
              .or_insert(Vec::new())
              .push(result);

            return Ok(true);
          }
        }

        return Ok(false);
      },
      include_diagrams,
      false,
      limit,
    )?;
  }

  // SEARCH IN LIBRARY
  if include_library {
    let found_lib_element = search_library_element(alias)?;
    if let Some(lib_element) = found_lib_element {
      let path = path_from_element_type(&lib_element)?;
      let mut result = DiagramElementSearchResult {
        category: FileSearchCategory::Library,
        path: path.clone(),
        partial_match: true,
      };

      let plantuml_found_lib_element =
        serialize_elements_to_plantuml(&vec![lib_element.clone()], 0);

      // clean the plantuml
      let cleaned_plantuml_found_lib_element =
        clean_plantuml_diagram_element(&plantuml_found_lib_element)?;

      if cleaned_plantuml_diagram_element.eq(&cleaned_plantuml_found_lib_element) {
        result.partial_match = false;
      }

      results
        .entry(path.clone())
        .or_insert(Vec::new())
        .push(result);
    }
  }

  let count = results.len().try_into().unwrap();
  return Ok(DiagramElementSearchResults {
    results,
    count,
    reached_limit,
  });
}
