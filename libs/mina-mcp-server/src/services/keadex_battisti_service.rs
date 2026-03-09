use crate::models::requests::render_diagram_request::RenderDiagramRequest;
use reqwest::Response;

const API_BASE: &str = "https://localhost:4200/api";
const USER_AGENT: &str = "mina-mcp-service/3.x";

pub async fn render_diagram(request: RenderDiagramRequest) -> Result<String, reqwest::Error> {
  make_request::<RenderDiagramRequest>(&format!("{}/mina-diagram", API_BASE), request)
    .await?
    .text()
    .await
}

async fn make_request<R: serde::Serialize>(url: &str, body: R) -> Result<Response, reqwest::Error> {
  let client = reqwest::Client::new();
  let rsp = client
    .post(url)
    .body(serde_json::to_string(&body).unwrap())
    .header(reqwest::header::USER_AGENT, USER_AGENT)
    .header(reqwest::header::ACCEPT, "*/*")
    .header(reqwest::header::CONTENT_TYPE, "application/json")
    .send()
    .await?
    .error_for_status()?;

  Ok(rsp)
}
