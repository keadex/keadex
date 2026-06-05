use crate::core::server::KeadexMinaServer;
use crate::models::requests::read_remote_diagram_request::ReadRemoteDiagramRequest;
use crate::models::requests::render_diagram_request::RenderDiagramRequest;
use crate::services::diagram_service::download_diagram_data;
use crate::services::diagram_service::render_diagram;
use keadex_mina::controller::diagram_controller::open_remote_diagram;
use keadex_mina::model::diagram::Diagram;
use keadex_mina::model::project_settings::ProjectSettings;
use keadex_mina::model::themes::diagrams_theme_settings::DiagramsThemeSettings;
use rmcp::model::{Annotated, Content, RawContent};

pub async fn read_diagram_tool(
  _router: &KeadexMinaServer,
  request: ReadRemoteDiagramRequest,
) -> Result<Option<(Diagram, Option<DiagramsThemeSettings>)>, String> {
  let project_root_url = request.project_root_url;
  let diagram_url = request.diagram_url;
  let gh_token = request.gh_token.as_deref();
  match download_diagram_data(&project_root_url, &diagram_url, gh_token).await {
    Ok(Some(diagram_data)) => {
      let diagram = open_remote_diagram(
        project_root_url.to_string(),
        diagram_url.to_string(),
        diagram_data.plantuml,
        diagram_data.spec,
      )
      .await
      .map_err(|err| err.msg)?;
      let project_settings: ProjectSettings =
        serde_json::from_str(&diagram_data.project_settings_json).map_err(|e| e.to_string())?;
      let diagrams_theme_settings = project_settings
        .themes_settings
        .and_then(|ts| ts.diagrams_theme_settings);
      Ok(Some((diagram, diagrams_theme_settings)))
    }
    Ok(None) => Ok(None),
    Err(e) => Err(e),
  }
}

pub async fn render_diagram_tool(
  _router: &KeadexMinaServer,
  request: ReadRemoteDiagramRequest,
) -> Result<Annotated<RawContent>, String> {
  // Read remote diagram
  let diagram_data = read_diagram_tool(_router, request).await?;
  let (diagram, diagrams_theme_settings) = match diagram_data {
    Some((diagram, diagrams_theme_settings)) => (diagram, diagrams_theme_settings),
    None => return Err("Diagram not found. Please verify the URLs provided, or, if linking to a private repository, ensure the GitHub token is configured.".to_string()),
  };

  // Invoke Mina nodejs API to render diagram
  let encoded_png = render_diagram(RenderDiagramRequest {
    diagrams_theme_settings,
    diagram,
  })
  .await?;

  Ok(Content::image(encoded_png, "image/png"))
}
