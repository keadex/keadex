use cfg_aliases::cfg_aliases;

fn main() {
  cfg_aliases! {
    desktop: { all(feature = "desktop", not(feature = "web")) },
    web: { all(feature = "web", not(feature = "desktop")) },
    cross: { any(feature = "desktop", feature = "web", feature = "custom-protocol") },
  }

  #[cfg(feature = "desktop")]
  tauri_build::build()
}
