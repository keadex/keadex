/*!
App
This represents the shell of the application.
*/

use crate::core::logger;
use crate::core::resolver::RootResolver;
use crate::core::state::State;
use async_std::sync::RwLock;
use dotenv::dotenv;
use state::InitCell;

pub static ROOT_RESOLVER: InitCell<RwLock<RootResolver>> = InitCell::new();
pub static APP_STATE: InitCell<RwLock<State>> = InitCell::new();

pub struct App;

impl App {
  pub fn new() -> Self {
    ROOT_RESOLVER.set(RwLock::new(RootResolver::default()));
    APP_STATE.set(RwLock::new(State::default()));
    App {}
  }
  pub fn init() -> Self {
    #[cfg(web)]
    console_error_panic_hook::set_once();
    dotenv().ok();
    logger::init();
    return App::new();
  }
}
