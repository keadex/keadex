use crate::model::commands::search_and_replace::SearchAndReplace;
use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::service::search_service::search_and_replace_text;

pub async fn search_and_replace(
  search_and_replace_args: SearchAndReplace,
) -> Result<(), MinaError> {
  let results = search_and_replace_text(
    search_and_replace_args.text_to_search,
    search_and_replace_args.replacement,
    search_and_replace_args.include_diagrams,
    search_and_replace_args.include_library,
    false,
    false,
  )
  .await?;
  let json = serialize_obj_to_json_string(&results, false)?;
  println!("{}", json);
  return Ok(());
}
