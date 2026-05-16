use keadex_mina::repository::project_repository;

pub async fn ensure_project_is_open() -> Result<(), String> {
  project_repository::get_project_settings()
    .await
    .map_err(|_| "Project is not open".to_string())
    .map(|_| ())
}
