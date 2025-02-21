use crate::error_handling::mina_error::MinaError;
use crate::model::hook::HookPayload;
use crate::service::hook_service;
use keadex_mina_macro::web_controller;

/**
Executes the gived hook.
Returns true if the hook has been successfully executed.
# Arguments
  * `payload` - Payload of the hook to execute
*/
#[cfg_attr(desktop, tauri::command)]
#[cfg_attr(web, web_controller)]
pub async fn execute_hook(payload: HookPayload) -> Result<bool, MinaError> {
  log::info!("Executing hook {:?}", payload.hook_type);
  let _ = hook_service::execute_hook(payload);
  Ok(true)
}
