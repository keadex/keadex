use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::model::diagram_element_search_results::DiagramElementSearchResults;
use crate::model::file_search_results::FileSearchResults;
use crate::resolve_to_write;
use crate::service::search_service::search_diagram_element;
use crate::service::search_service::search_text;

/**
Searches for the given string in the project's files.
# Arguments
  * `string` - String to search for.
  * `include_diagrams_dir` - If you want to include the diagrams directory in the search.
  * `include_library_dir` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
#[tauri::command]
pub async fn search(
  string_to_search: &str,
  include_diagrams_dir: bool,
  include_library_dir: bool,
  limit: i32,
) -> Result<FileSearchResults, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();
  log::info!("Search {} in {}", string_to_search, project_settings.root);

  Ok(search_text(
    string_to_search,
    include_diagrams_dir,
    include_library_dir,
    limit,
  )?)
}

/**
Searches for the given diagram element alias in the project's files.
# Arguments
  * `alias` - Alias of the diagram element to search for.
  * `include_diagrams_dir` - If you want to include the diagrams directory in the search.
  * `include_library_dir` - If you want to include the library directory in the search.
  * `limit` - Limit of the returned results.
*/
#[tauri::command]
pub async fn search_diagram_element_alias(
  alias: &str,
  include_diagrams_dir: bool,
  include_library_dir: bool,
  limit: i32,
) -> Result<DiagramElementSearchResults, MinaError> {
  return search_diagram_element(alias, "", include_diagrams_dir, include_library_dir, limit);
}
