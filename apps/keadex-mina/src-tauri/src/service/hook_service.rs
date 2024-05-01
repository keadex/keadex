use crate::core::app::ROOT_RESOLVER;
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::core::serializer::serialize_obj_to_json_string;
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::mina_error::MinaError;
use crate::helper::hook_helper::hooks_path;
use crate::model::hook::{HookData, HookPayload};
use crate::resolve_to_write;
use std::process::Command;

pub const HOOKS_FILE_NAME: &str = "hooks.js";

/**
Executes the gived hook.
Returns true if the hook has been successfully executed.
# Arguments
  * `payload` - Payload of the hook to execute
*/
pub async fn execute_hook(payload: HookPayload) -> Result<bool, MinaError> {
  log::info!("Executing hook {:?}", payload.hook_type);

  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO)
    .get()
    .unwrap();

  let hooks_file_path = hooks_path(&project_settings.root);
  let mut serialized_data = String::from("undefined");
  if let Some(data) = payload.data {
    match data {
      HookData::Diagram(diagram) => {
        serialized_data = serialize_obj_to_json_string(&diagram, false)?;
      }
    }
  }
  let import = format!(
    "require({:?}).{}(JSON.parse({:?}))",
    hooks_file_path, payload.hook_type, serialized_data
  );

  // Execute the JavaScript code using the 'node -e' option
  let mut output = Command::new("node");
  output.arg("-e");
  output.arg(import);

  let result = output.status();
  if let Ok(_res) = result {
    log::info!("Hook {:?} successfully executed!", payload.hook_type);
  } else {
    log::info!(
      "An error occurred while executing the hook {:?}.",
      payload.hook_type
    );
  }
  Ok(true)
}
