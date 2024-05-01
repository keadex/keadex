use crate::error_handling::mina_error::MinaError;
use crate::model::hook::HookPayload;
use crate::service::hook_service;

/**
Executes the gived hook.
Returns true if the hook has been successfully executed.
# Arguments
  * `payload` - Payload of the hook to execute
*/
#[tauri::command]
pub async fn execute_hook(payload: HookPayload) -> Result<bool, MinaError> {
  log::info!("Executing hook {:?}", payload.hook_type);
  let _ = hook_service::execute_hook(payload);
  Ok(true)
}
