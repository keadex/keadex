use crate::api::filesystem::CrossPathBuf;
use crate::api::filesystem::FileSystemAPI as FsApiTrait;
use crate::core::app::ROOT_RESOLVER;
use crate::core::project_initializer::load_project;
use crate::core::project_initializer::unload_project;
use crate::core::resolver::ResolvableModules::FileSystemAPI;
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
use async_std::sync::Arc;
use async_std::sync::RwLock;
use futures::future::join_all;
use std::collections::BTreeMap;
use std::future::Future;
use std::io::BufRead;
use std::path::Path;
use std::usize;

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
Checks if the given entry (directory or file) is searchable.
# Arguments
  * `entry` - Directory entry to check.
  * `include_diagrams_dir` - If you want to include the diagrams directory in the search.
  * `include_library_dir` - If you want to include the library directory in the search.
  * `diagrams_dir` - Path of the diagrams directory.
  * `library_dir`- Path of the project library directory.
*/
fn is_searchable_entry(
  entry: &CrossPathBuf,
  root_dir: &str,
  include_diagrams_dir: bool,
  include_library_dir: bool,
  diagrams_dir: &str,
  library_dir: &str,
) -> bool {
  if let Some(path) = entry.path.as_ref() {
    let is_searchable_path = path.eq(root_dir)
      || ((path.starts_with(diagrams_dir) || path.starts_with(library_dir))
        && (include_diagrams_dir || (!include_diagrams_dir && !path.starts_with(diagrams_dir)))
        && (include_library_dir || (!include_library_dir && !path.starts_with(library_dir))));
    let is_searchable_file = entry.is_dir
      || (!entry.is_dir && entry.file_name.ends_with(".json")
        || entry.file_name.ends_with(".puml"));
    return is_searchable_path && is_searchable_file;
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
pub async fn search_in_project<F, Fut>(
  concurrent: bool,
  mut predicate: F,
  include_diagrams: bool,
  include_library: bool,
  limit: usize,
) -> Result<bool, MinaError>
where
  F: FnMut(String, usize, String, String, String) -> Fut,
  Fut: Future<Output = Result<bool, MinaError>>,
{
  let max_concurrent_predicates: usize = 10000;

  let store = ROOT_RESOLVER.get().read().await;
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .get()
    .await;

  if let Some(project_settings) = project_settings {
    let temp_root_1 = String::from(&project_settings.root);
    let temp_root_2 = String::from(&project_settings.root);

    let diagrams_directory = diagrams_path(&temp_root_2);
    let library_directory = project_library_path(&temp_root_2);

    let mut count = 0;
    let mut reached_limit = false;
    let mut concurrent_predicates = vec![];

    // Unload the project since we need to unlock all the project's file in order to read them
    unload_project(&project_settings.root).await?;

    // Search for the given string in all the project's files
    let project_files = resolve_to_write!(store, FileSystemAPI)
      .await
      .walk_dir(&Path::new(&temp_root_1), |e| {
        is_searchable_entry(
          e,
          &temp_root_2,
          include_diagrams,
          include_library,
          &diagrams_directory,
          &library_directory,
        )
      })
      .await?;

    for entry in project_files {
      if !entry.is_dir {
        let path = entry.path.unwrap();
        let file = resolve_to_write!(store, FileSystemAPI)
          .await
          .open(true, false, false, false, &Path::new(&path))
          .await?;
        let reader = file.get_buffer().await?;

        for (line_num, line) in reader.lines().enumerate() {
          if let Ok(line) = line {
            if concurrent {
              // Execute the predicates in parallel
              concurrent_predicates.push(predicate(
                line,
                line_num,
                path.clone(),
                diagrams_directory.clone(),
                library_directory.clone(),
              ));

              if concurrent_predicates.len() == max_concurrent_predicates {
                let results = join_all(concurrent_predicates).await;
                for result in results {
                  if result.is_ok_and(|predicate_result| predicate_result) {
                    count += 1;
                    if count > limit {
                      reached_limit = true;
                      break;
                    }
                  }
                }
                concurrent_predicates = vec![];
                if reached_limit {
                  break;
                }
              }
            } else {
              // Execute the predicates sequentially
              if predicate(
                line,
                line_num,
                path.clone(),
                diagrams_directory.clone(),
                library_directory.clone(),
              )
              .await?
              {
                count += 1;
                if count > limit {
                  reached_limit = true;
                  break;
                }
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

    if concurrent && !reached_limit && concurrent_predicates.len() > 0 {
      // There are still some predicates to execute
      let results = join_all(concurrent_predicates).await;
      for result in results {
        if result.is_ok_and(|predicate_result| predicate_result) {
          count += 1;
          if count > limit {
            reached_limit = true;
            break;
          }
        }
      }
    }

    // (Re)load the project to make it available again to the client
    load_project(&temp_root_2).await?;

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
*/
pub async fn search_and_replace_text(
  text_to_search: &str,
  replacement: &str,
  include_diagrams: bool,
  include_library: bool,
) -> Result<FileSearchResults, MinaError> {
  log::debug!("Search {} and replace with {}", text_to_search, replacement);

  let current_path_rc = Arc::new(RwLock::new(String::from("")));
  let updated_content_opt_rc = Arc::new(RwLock::<Option<String>>::new(None));
  let new_line_rc = Arc::new(RwLock::new(String::from("")));
  let results_rc = Arc::new(RwLock::new(BTreeMap::new()));

  let reached_limit = search_in_project(
    false,
    |line, line_num, path, diagrams_directory, library_directory| {
      let current_path = Arc::clone(&current_path_rc);
      let updated_content_opt = Arc::clone(&updated_content_opt_rc);
      let new_line = Arc::clone(&new_line_rc);
      let results = Arc::clone(&results_rc);
      async move {
        if !current_path.read().await.eq(&path) {
          let store = ROOT_RESOLVER.get().read().await;
          if !current_path.read().await.eq("") {
            resolve_to_write!(store, FileSystemAPI)
              .await
              .open(
                true,
                true,
                false,
                false,
                Path::new(&(current_path.read().await.as_str())),
              )
              .await?
              .write_all(
                updated_content_opt
                  .read()
                  .await
                  .as_ref()
                  .unwrap()
                  .as_bytes(),
              )
              .await?;
          }
          *current_path.write().await = path.to_string();
          *updated_content_opt.write().await = Some(String::from(""));
        }

        let mut is_found = Ok(false);
        if updated_content_opt.read().await.is_some() {
          if line.eq(&text_to_search) {
            *new_line.write().await = replacement.to_string();
            is_found = Ok(true);

            results
              .write()
              .await
              .entry(String::from(&path))
              .or_insert(Vec::new())
              .push(FileSearchResult {
                line_content: String::from(line),
                line_number: line_num + 1,
                category: get_category(&path, &diagrams_directory, &library_directory),
                path: String::from(path),
              });
          } else {
            *new_line.write().await = line;
            is_found = Ok(false)
          }

          updated_content_opt
            .write()
            .await
            .as_mut()
            .unwrap()
            .push_str(&format!("{}\n", new_line.read().await));

          return is_found;
        }
        return is_found;
      }
    },
    include_diagrams,
    include_library,
    usize::MAX,
  )
  .await?;

  if !current_path_rc.read().await.eq("") {
    let store = ROOT_RESOLVER.get().read().await;
    resolve_to_write!(store, FileSystemAPI)
      .await
      .open(
        true,
        true,
        false,
        false,
        Path::new(&(current_path_rc.read().await.as_str())),
      )
      .await?
      .write_all(
        updated_content_opt_rc
          .read()
          .await
          .as_ref()
          .unwrap()
          .as_bytes(),
      )
      .await?;
  }

  let count = results_rc.read().await.len().try_into().unwrap();
  Ok(FileSearchResults {
    results: Arc::try_unwrap(results_rc).unwrap().into_inner(),
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
pub async fn search_text(
  text_to_search: &str,
  include_diagrams: bool,
  include_library: bool,
  limit: usize,
) -> Result<FileSearchResults, MinaError> {
  let results_rc = Arc::new(RwLock::new(BTreeMap::new()));
  let reached_limit = search_in_project(
    true,
    |line, line_num, path, diagrams_directory, library_directory| {
      let results = Arc::clone(&results_rc);
      async move {
        if line.to_lowercase().contains(&text_to_search.to_lowercase()) {
          if results.read().await.len() <= limit {
            results
              .write()
              .await
              .entry(String::from(&path))
              .or_insert(Vec::new())
              .push(FileSearchResult {
                line_content: String::from(line),
                line_number: line_num + 1,
                category: get_category(&path, &diagrams_directory, &library_directory),
                path: String::from(path),
              });
          }
          return Ok(true);
        }
        return Ok(false);
      }
    },
    include_diagrams,
    include_library,
    limit,
  )
  .await?;

  let count = results_rc.read().await.len().try_into().unwrap();
  Ok(FileSearchResults {
    results: Arc::try_unwrap(results_rc).unwrap().into_inner(),
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
pub async fn search_diagram_element(
  alias: &str,
  plantuml_diagram_element: &str,
  include_diagrams: bool,
  include_library: bool,
  limit: usize,
) -> Result<DiagramElementSearchResults, MinaError> {
  // clean the plantuml
  let cleaned_plantuml_diagram_element = clean_plantuml_diagram_element(plantuml_diagram_element)?;
  let re_diagrams_dir = create_search_diagram_elem_in_plantuml_regex(alias);

  let results_rc = Arc::new(RwLock::new(BTreeMap::new()));
  let mut reached_limit = false;

  // SEARCH IN DIAGRAMS
  if include_diagrams {
    reached_limit = search_in_project(
      true,
      |line, _line_num, path, diagrams_directory, library_directory| {
        let re_diagrams_dir_clone = re_diagrams_dir.clone();
        let cleaned_plantuml_diagram_element_clone = cleaned_plantuml_diagram_element.clone();
        let results = Arc::clone(&results_rc);
        async move {
          // clean the line
          let cleaned_line = clean_plantuml_diagram_element(&line)?;

          let category = get_category(&path, &diagrams_directory, &library_directory);

          let result = re_diagrams_dir_clone.is_match(&cleaned_line);
          if result.is_ok() {
            let did_match = result.unwrap();
            if did_match {
              if results.read().await.len() <= limit {
                let mut result = DiagramElementSearchResult {
                  category,
                  path: String::from(&path),
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
                if cleaned_plantuml_diagram_element_clone.starts_with(&cleaned_line) {
                  result.partial_match = false
                }

                results
                  .write()
                  .await
                  .entry(String::from(&path))
                  .or_insert(Vec::new())
                  .push(result);
              }
              return Ok(true);
            }
          }

          return Ok(false);
        }
      },
      include_diagrams,
      false,
      limit,
    )
    .await?;
  }

  // SEARCH IN LIBRARY
  if include_library {
    let found_lib_element = search_library_element(alias).await?;
    if let Some(lib_element) = found_lib_element {
      let results = Arc::clone(&results_rc);
      let path = path_from_element_type(&lib_element).await?;
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
        .write()
        .await
        .entry(path.clone())
        .or_insert(Vec::new())
        .push(result);
    }
  }

  let count = results_rc.read().await.len().try_into().unwrap();
  return Ok(DiagramElementSearchResults {
    results: Arc::try_unwrap(results_rc).unwrap().into_inner(),
    count,
    reached_limit,
  });
}
