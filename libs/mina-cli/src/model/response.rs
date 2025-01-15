use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct Response {
  pub code: i32,
  pub message: String,
}
