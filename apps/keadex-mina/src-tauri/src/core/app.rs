/*!
App
This represents the shell of the application.
*/

use crate::core::resolver::RootResolver;
use crate::core::state::State;
use state::InitCell;
use std::sync::RwLock;

pub static ROOT_RESOLVER: InitCell<RwLock<RootResolver>> = InitCell::new();
pub static APP_STATE: InitCell<RwLock<State>> = InitCell::new();

pub struct App;

impl Default for App {
  fn default() -> Self {
    App::new()
  }
}

impl App {
  pub fn new() -> Self {
    ROOT_RESOLVER.set(RwLock::new(RootResolver::default()));
    APP_STATE.set(RwLock::new(State::default()));
    App {}
  }
}
