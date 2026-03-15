use crate::models::requests::render_diagram_request::RenderDiagramRequest;
use bytes::Bytes;
use reqwest::Response;
use reqwest::header::HeaderMap;

const API_BASE: &str = "https://localhost:4200/api";
const USER_AGENT: &str = "mina-mcp-service/3.x";

pub async fn render_diagram(request: RenderDiagramRequest) -> Result<Bytes, reqwest::Error> {
  let mut headers: HeaderMap = HeaderMap::new();
  headers.insert("Keadex-Mina-Diagram-Format", "png".parse().unwrap());
  return make_request::<RenderDiagramRequest>(
    &format!("{}/mina-diagram", API_BASE),
    request,
    headers,
  )
  .await?
  .bytes()
  .await;
}

async fn make_request<R: serde::Serialize>(
  url: &str,
  body: R,
  headers: HeaderMap,
) -> Result<Response, reqwest::Error> {
  let client = reqwest::Client::new();
  let rsp = client
    .post(url)
    .body(serde_json::to_string(&body).unwrap())
    .header(reqwest::header::USER_AGENT, USER_AGENT)
    .header(reqwest::header::ACCEPT, "*/*")
    .header(reqwest::header::CONTENT_TYPE, "application/json")
    .headers(headers)
    .send()
    .await?
    .error_for_status()?;

  Ok(rsp)
}
