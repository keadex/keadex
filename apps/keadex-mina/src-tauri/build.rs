use cfg_aliases::cfg_aliases;

fn main() {
  cfg_aliases! {
    desktop: { all(feature = "desktop", not(feature = "web"), not(feature = "mina_web_viewer")) },
    web: { all(feature = "web", not(feature = "desktop"), not(feature = "mina_web_viewer")) },
    cross: { any(feature = "desktop", feature = "web", feature = "custom-protocol") },
    mina_web_viewer: { feature = "mina-web-viewer" },
  }

  #[cfg(feature = "desktop")]
  tauri_build::build()
}
