use crate::core::node_bridge::NodeBridge;
use crate::models::requests::render_diagram_request::RenderDiagramRequest;
use crate::services::gh_service::fetch_gh_raw_file;
use keadex_mina::helper::diagram_helper::diagram_plantuml_url_from_diagram_url;
use keadex_mina::helper::diagram_helper::diagram_spec_url_from_diagram_url;
use keadex_mina::helper::project_helper::project_settings_url;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Deserialize, Serialize)]
pub struct DiagramData {
  pub project_settings_json: String,
  pub plantuml: String,
  pub spec: String,
}

pub async fn render_diagram(request: RenderDiagramRequest) -> Result<String, String> {
  let result = NodeBridge::global()
    .call("renderDiagram", json!([request]))
    .await?;
  Ok(result.as_str().unwrap_or_default().to_string())
}

pub async fn download_diagram_data(
  project_root_url: &str,
  diagram_url: &str,
  gh_token: Option<&str>,
) -> Result<Option<DiagramData>, String> {
  let project_settings_url = project_settings_url(project_root_url);
  let plantuml_url =
    diagram_plantuml_url_from_diagram_url(project_root_url, diagram_url).map_err(|e| e.msg)?;
  let spec_url =
    diagram_spec_url_from_diagram_url(project_root_url, diagram_url).map_err(|e| e.msg)?;

  let (project_settings_response, plantuml_response, spec_response) = tokio::join!(
    fetch_gh_raw_file(&project_settings_url, gh_token),
    fetch_gh_raw_file(&plantuml_url, gh_token),
    fetch_gh_raw_file(&spec_url, gh_token)
  );

  let project_settings_response = project_settings_response?;
  let plantuml_response = plantuml_response?;
  let spec_response = spec_response?;

  if project_settings_response.status().is_success()
    && plantuml_response.status().is_success()
    && spec_response.status().is_success()
  {
    let project_settings_json = project_settings_response
      .text()
      .await
      .map_err(|e| e.to_string())?;
    let plantuml = plantuml_response.text().await.map_err(|e| e.to_string())?;
    let spec = spec_response.text().await.map_err(|e| e.to_string())?;
    Ok(Some(DiagramData {
      project_settings_json,
      plantuml,
      spec,
    }))
  } else {
    Err(
      "Diagram or project settings not found. Please verify the URLs provided, or, if linking to a private repository, ensure the GitHub token is configured.".to_string())
  }
}
