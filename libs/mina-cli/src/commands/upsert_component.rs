use crate::commands::{create_component::create_component, update_component::update_component};
use crate::constants::messages::{
  ERROR_UPSERT_ELEMENT_MISSING_FIELDS, SUCCESS_INSERT_ELEMENT_UPSERT, SUCCESS_UPDATE_ELEMENT,
};
use crate::model::commands::create_component::CreateComponent;
use crate::model::commands::update_component::UpdateComponent;
use crate::model::response::Response;
use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::repository::library::library_repository::search_library_element;
use std::collections::HashMap;
use strfmt::strfmt;

pub fn upsert_component(args: UpdateComponent) -> Result<(), MinaError> {
  let result = search_library_element(&args.alias);
  if let Ok(found) = result {
    if found.is_some() {
      // The element exists, so we can update it
      let result = update_component(args);
      if result.is_ok() {
        let response = Response {
          code: 0,
          message: SUCCESS_UPDATE_ELEMENT.to_string(),
        };
        let json = serialize_obj_to_json_string(&response, false)?;
        println!("{}", json);
      }
      return result;
    }
  }

  // The element does not exist, so we have to create it
  let mut vars = HashMap::new();
  vars.insert("alias".to_string(), args.alias.clone());
  vars.insert(
    "fields".to_string(),
    "new-label, new-component-type, new-technology".to_string(),
  );
  if args.new_label.is_some() && args.new_component_type.is_some() && args.new_technology.is_some()
  {
    // All required fields have been passed, so we can proceed with the creation
    let create_args = CreateComponent {
      alias: args.alias.clone(),
      label: args.new_label.unwrap(),
      component_type: args.new_component_type.unwrap(),
      technology: args.new_technology.unwrap(),
      description: args.new_description,
      link: args.new_link,
      notes: args.new_notes,
    };
    let result = create_component(create_args);
    if result.is_ok() {
      let response = Response {
        code: 0,
        message: strfmt(SUCCESS_INSERT_ELEMENT_UPSERT, &vars).unwrap(),
      };
      let json = serialize_obj_to_json_string(&response, false)?;
      println!("{}", json);
    }
    return result;
  } else {
    // Some required fields have not been passed, so we cannot proceed with the creation
    return Err(MinaError {
      code: 1,
      msg: strfmt(ERROR_UPSERT_ELEMENT_MISSING_FIELDS, &vars).unwrap(),
    });
  }
}
