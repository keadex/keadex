use cfg_aliases::cfg_aliases;

fn main() {
  cfg_aliases! {
    desktop: { feature = "desktop" },
    web: { feature = "web" },
    cross: { any(feature = "desktop", feature = "web", feature = "custom-protocol") },
    mina_web_viewer: { feature = "mina-web-viewer" },
  }

  #[cfg(feature = "desktop")]
  tauri_build::build()
}
