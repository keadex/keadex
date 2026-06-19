use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct GenericResponse {
  pub code: i32,
  pub message: String,
}
