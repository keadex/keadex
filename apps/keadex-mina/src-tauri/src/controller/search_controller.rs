use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::model::diagram_element_search_results::DiagramElementSearchResults;
use crate::model::file_search_results::FileSearchResults;
use crate::resolve_to_write;
use crate::service::search_service::search_and_replace_text;
use crate::service::search_service::search_diagram_element;
use crate::service::search_service::search_text;
use keadex_mina_macro::web_controller;

/**
Searches for the given string in the project's files.
# Arguments
  * `string_to_search` - String to search for.
  * `include_diagrams_dir` - If you want to include the diagrams directory in the search.
  * `include_library_dir` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn search(
  string_to_search: String,
  include_diagrams_dir: bool,
  include_library_dir: bool,
  limit: usize,
) -> Result<FileSearchResults, MinaError> {
  let store = ROOT_RESOLVER.get().read().await;
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .get()
    .await
    .unwrap();
  log::info!("Search {} in {}", string_to_search, project_settings.root);

  Ok(
    search_text(
      string_to_search,
      include_diagrams_dir,
      include_library_dir,
      limit,
    )
    .await?,
  )
}

/**
Searches for the given string in the project's files and replaces the found occurrences with the given replacement string.
# Arguments
  * `string_to_search` - String to search for.
  * `replacement` - Replacement.
  * `include_diagrams_dir` - If you want to include the diagrams directory in the search.
  * `include_library_dir` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn search_and_replace(
  string_to_search: String,
  replacement: String,
  include_diagrams_dir: bool,
  include_library_dir: bool,
) -> Result<FileSearchResults, MinaError> {
  let store = ROOT_RESOLVER.get().read().await;
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .await
    .get()
    .await
    .unwrap();
  log::info!(
    "Search {} in {} and replace with {}",
    string_to_search,
    project_settings.root,
    replacement
  );

  Ok(
    search_and_replace_text(
      string_to_search,
      replacement,
      include_diagrams_dir,
      include_library_dir,
      false,
      false,
    )
    .await?,
  )
}

/**
Searches for the given diagram element alias in the project's files.
# Arguments
  * `alias` - Alias of the diagram element to search for.
  * `include_diagrams_dir` - If you want to include the diagrams directory in the search.
  * `include_library_dir` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn search_diagram_element_alias(
  alias: String,
  include_diagrams_dir: bool,
  include_library_dir: bool,
  limit: usize,
) -> Result<DiagramElementSearchResults, MinaError> {
  return search_diagram_element(&alias, "", include_diagrams_dir, include_library_dir, limit)
    .await;
}
