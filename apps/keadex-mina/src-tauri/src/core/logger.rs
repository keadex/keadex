/*!
Application logging.
This module wraps a logger to produce line-delimited JSON instead of regular text.
That makes it a bit nicer to consume through some sidecar or ambient environment
that collects and surfaces log events.
*/

use chrono::Utc;
use env_logger::{Builder, Env};
use log::Level;
use serde::Serialize;
use snailquote::unescape;
use std::io::Write;

/** The environment variable to read the level filter from. */
pub const LOG_LEVEL_ENV: &str = "LOG_LEVEL";
/** The environment variable to read the style info from. */
pub const LOG_STYLE_ENV: &str = "LOG_STYLE";

#[derive(Serialize)]
struct SerializeRecord<'a> {
  #[serde(rename = "@t")]
  ts: String,
  #[serde(rename = "@l")]
  lvl: Level,
  #[serde(skip_serializing_if = "Option::is_none")]
  module_path: Option<&'a str>,
  #[serde(rename = "@m")]
  msg: String,
}

/** Initialize the global logger. */
pub fn init() {
  #[cfg(desktop)]
  {
    let mut level_log = "info";
    if cfg!(debug_assertions) {
      level_log = "debug";
    }
    let env = Env::default()
      .filter_or(LOG_LEVEL_ENV, level_log)
      .write_style(LOG_STYLE_ENV);

    Builder::from_env(env)
      .format(|mut buf, record| {
        let msg = unescape(record.args().to_string().as_str()).unwrap();
        // if msg.contains("local-debug-filter:") {
        let record = SerializeRecord {
          ts: Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
          lvl: record.level(),
          module_path: record.module_path(),
          msg: msg.clone(),
        };
        serde_json::to_writer(&mut buf, &record)?;
        writeln!(buf)
        // } else {
        //   Ok(())
        // }
      })
      .init();
  }
  #[cfg(web)]
  {
    let mut level_log = Level::Info;
    if cfg!(debug_assertions) {
      level_log = Level::Debug;
    }
    let _ = console_log::init_with_level(level_log);
  }
}

pub fn debug(msg: &str) {
  #[cfg(desktop)]
  {
    log::debug!("{:?}", msg);
  }

  #[cfg(web)]
  {
    web_sys::console::debug_1(&wasm_bindgen::JsValue::from_str(msg));
  }
}
