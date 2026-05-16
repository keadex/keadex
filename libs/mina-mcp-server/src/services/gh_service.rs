use reqwest::{Client, header::InvalidHeaderValue};

pub async fn fetch_gh_raw_file(
  url: &str,
  gh_token: Option<&str>,
) -> Result<reqwest::Response, String> {
  let client = Client::new();
  if let Some(token) = gh_token {
    // Use the Keadex API as a proxy only when a GitHub token is configured.
    // In this case, in fact, you have to invoke the GitHub endpoint by passing
    // the token in the "Authorization" header, which is allowed only on server-side.
    let mut headers = reqwest::header::HeaderMap::new();
    headers.insert(
      "Keadex-Gh-Url",
      url.parse().map_err(|e: InvalidHeaderValue| e.to_string())?,
    );
    headers.insert(
      "Keadex-Gh-Authorization",
      token
        .parse()
        .map_err(|e: InvalidHeaderValue| e.to_string())?,
    );
    client
      .post("https://keadex.dev/api/download-gh-raw-file")
      .headers(headers)
      .send()
      .await
      .map_err(|e| e.to_string())
  } else {
    client.get(url).send().await.map_err(|e| e.to_string())
  }
}
