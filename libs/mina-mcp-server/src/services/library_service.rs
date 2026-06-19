use crate::constants::messages::{
  ERROR_UPSERT_ELEMENT_MISSING_FIELDS, SUCCESS_INSERT_ELEMENT_UPSERT, SUCCESS_UPDATE_ELEMENT,
};
use crate::models::requests::create_component_request::CreateComponentRequest;
use crate::models::requests::create_container_request::CreateContainerRequest;
use crate::models::requests::create_person_request::CreatePersonRequest;
use crate::models::requests::create_system_request::CreateSystemRequest;
use crate::models::requests::{
  update_component_request::UpdateComponentRequest,
  update_container_request::UpdateContainerRequest, update_person_request::UpdatePersonRequest,
  update_system_request::UpdateSystemRequest,
};
use crate::models::responses::generic_response::GenericResponse;
use keadex_mina::core::serializer::serialize_obj_to_json_string;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::c4_element::component::Component;
use keadex_mina::model::c4_element::container::Container;
use keadex_mina::model::c4_element::person::Person;
use keadex_mina::model::c4_element::software_system::SoftwareSystem;
use keadex_mina::model::diagram::diagram_plantuml::DiagramElementType;
use keadex_mina::repository::library::library_repository::create_element;
use keadex_mina::repository::library::library_repository::search_library_element;
use keadex_mina::repository::library::library_repository::update_element;
use std::collections::HashMap;
use strfmt::strfmt;
use uuid::Uuid;

pub async fn create_component(args: CreateComponentRequest) -> Result<(), MinaError> {
  let mut component = Component::default();
  component.base_data.uuid = Some(Uuid::new_v4().to_string());
  component.base_data.alias = Some(args.alias);
  component.base_data.description = args.description;
  component.base_data.label = Some(args.label);
  component.base_data.link = args.link;
  component.base_data.notes = args.notes;
  component.component_type = Some(args.component_type);
  component.technology = Some(args.technology);

  create_element(&DiagramElementType::Component(component)).await?;
  return Ok(());
}

pub async fn update_component(
  update_component_args: UpdateComponentRequest,
) -> Result<(), MinaError> {
  let component = search_library_element(&update_component_args.alias).await?;
  if let Some(found_component) = component {
    if let DiagramElementType::Component(found_component) = found_component {
      let old_component = found_component.clone();
      let mut new_component = found_component.clone();

      if update_component_args.new_label.is_some() {
        new_component.base_data.label = update_component_args.new_label;
      }
      if update_component_args.new_component_type.is_some() {
        new_component.component_type = update_component_args.new_component_type;
      }
      if update_component_args.new_technology.is_some() {
        new_component.technology = update_component_args.new_technology;
      }
      if update_component_args.new_description.is_some() {
        new_component.base_data.description = update_component_args.new_description;
      }
      if update_component_args.new_link.is_some() {
        new_component.base_data.link = update_component_args.new_link;
      }
      if update_component_args.new_notes.is_some() {
        new_component.base_data.notes = update_component_args.new_notes;
      }

      update_element(
        &DiagramElementType::Component(old_component),
        &DiagramElementType::Component(new_component),
      )
      .await?;
      return Ok(());
    }
  }
  return Err(MinaError::new(
    -1,
    &format!(
      "Component with alias \"{}\" not found.",
      &update_component_args.alias
    ),
  ));
}

pub async fn upsert_component(args: UpdateComponentRequest) -> Result<GenericResponse, MinaError> {
  let result = search_library_element(&args.alias).await;
  if let Ok(found) = result {
    if found.is_some() {
      // The element exists, so we can update it
      let _ = update_component(args).await?;
      let response = GenericResponse {
        code: 0,
        message: SUCCESS_UPDATE_ELEMENT.to_string(),
      };
      return Ok(response);
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
    let create_args = CreateComponentRequest {
      alias: args.alias.clone(),
      label: args.new_label.unwrap(),
      component_type: args.new_component_type.unwrap(),
      technology: args.new_technology.unwrap(),
      description: args.new_description,
      link: args.new_link,
      notes: args.new_notes,
    };
    let _ = create_component(create_args).await?;
    let response = GenericResponse {
      code: 0,
      message: strfmt(SUCCESS_INSERT_ELEMENT_UPSERT, &vars).unwrap(),
    };
    return Ok(response);
  } else {
    // Some required fields have not been passed, so we cannot proceed with the creation
    return Err(MinaError {
      code: 1,
      msg: strfmt(ERROR_UPSERT_ELEMENT_MISSING_FIELDS, &vars).unwrap(),
    });
  }
}

pub async fn create_container(args: CreateContainerRequest) -> Result<(), MinaError> {
  let mut container = Container::default();
  container.base_data.uuid = Some(Uuid::new_v4().to_string());
  container.base_data.alias = Some(args.alias);
  container.base_data.description = args.description;
  container.base_data.label = Some(args.label);
  container.base_data.link = args.link;
  container.base_data.notes = args.notes;
  container.container_type = Some(args.container_type);
  container.technology = Some(args.technology);

  create_element(&DiagramElementType::Container(container)).await?;
  return Ok(());
}

pub async fn update_container(
  update_container_args: UpdateContainerRequest,
) -> Result<(), MinaError> {
  let container = search_library_element(&update_container_args.alias).await?;
  if let Some(found_container) = container {
    if let DiagramElementType::Container(found_container) = found_container {
      let old_container = found_container.clone();
      let mut new_container = found_container.clone();

      if update_container_args.new_label.is_some() {
        new_container.base_data.label = update_container_args.new_label;
      }
      if update_container_args.new_container_type.is_some() {
        new_container.container_type = update_container_args.new_container_type;
      }
      if update_container_args.new_technology.is_some() {
        new_container.technology = update_container_args.new_technology;
      }
      if update_container_args.new_description.is_some() {
        new_container.base_data.description = update_container_args.new_description;
      }
      if update_container_args.new_link.is_some() {
        new_container.base_data.link = update_container_args.new_link;
      }
      if update_container_args.new_notes.is_some() {
        new_container.base_data.notes = update_container_args.new_notes;
      }

      update_element(
        &DiagramElementType::Container(old_container),
        &DiagramElementType::Container(new_container),
      )
      .await?;
      return Ok(());
    }
  }
  return Err(MinaError::new(
    -1,
    &format!(
      "Container with alias \"{}\" not found.",
      &update_container_args.alias
    ),
  ));
}

pub async fn upsert_container(args: UpdateContainerRequest) -> Result<GenericResponse, MinaError> {
  let result = search_library_element(&args.alias).await;
  if let Ok(found) = result {
    if found.is_some() {
      // The element exists, so we can update it
      let _ = update_container(args).await?;
      let response = GenericResponse {
        code: 0,
        message: SUCCESS_UPDATE_ELEMENT.to_string(),
      };
      return Ok(response);
    }
  }

  // The element does not exist, so we have to create it
  let mut vars = HashMap::new();
  vars.insert("alias".to_string(), args.alias.clone());
  vars.insert(
    "fields".to_string(),
    "new-label, new-container-type, new-technology".to_string(),
  );
  if args.new_label.is_some() && args.new_container_type.is_some() && args.new_technology.is_some()
  {
    // All required fields have been passed, so we can proceed with the creation
    let create_args = CreateContainerRequest {
      alias: args.alias.clone(),
      label: args.new_label.unwrap(),
      container_type: args.new_container_type.unwrap(),
      technology: args.new_technology.unwrap(),
      description: args.new_description,
      link: args.new_link,
      notes: args.new_notes,
    };
    let _ = create_container(create_args).await?;
    let response = GenericResponse {
      code: 0,
      message: strfmt(SUCCESS_INSERT_ELEMENT_UPSERT, &vars).unwrap(),
    };
    return Ok(response);
  } else {
    // Some required fields have not been passed, so we cannot proceed with the creation
    return Err(MinaError {
      code: 1,
      msg: strfmt(ERROR_UPSERT_ELEMENT_MISSING_FIELDS, &vars).unwrap(),
    });
  }
}

pub async fn create_person(args: CreatePersonRequest) -> Result<(), MinaError> {
  let mut person = Person::default();
  person.base_data.uuid = Some(Uuid::new_v4().to_string());
  person.base_data.alias = Some(args.alias);
  person.base_data.description = args.description;
  person.base_data.label = Some(args.label);
  person.base_data.notes = args.notes;
  person.person_type = Some(args.person_type);

  create_element(&DiagramElementType::Person(person)).await?;
  return Ok(());
}

pub async fn update_person(update_person_args: UpdatePersonRequest) -> Result<(), MinaError> {
  let person = search_library_element(&update_person_args.alias).await?;
  if let Some(found_person) = person {
    if let DiagramElementType::Person(found_person) = found_person {
      let old_person = found_person.clone();
      let mut new_person = found_person.clone();

      if update_person_args.new_label.is_some() {
        new_person.base_data.label = update_person_args.new_label;
      }
      if update_person_args.new_person_type.is_some() {
        new_person.person_type = update_person_args.new_person_type;
      }
      if update_person_args.new_description.is_some() {
        new_person.base_data.description = update_person_args.new_description;
      }
      if update_person_args.new_notes.is_some() {
        new_person.base_data.notes = update_person_args.new_notes;
      }

      update_element(
        &DiagramElementType::Person(old_person),
        &DiagramElementType::Person(new_person),
      )
      .await?;
      return Ok(());
    }
  }
  return Err(MinaError::new(
    -1,
    &format!(
      "Person with alias \"{}\" not found.",
      &update_person_args.alias
    ),
  ));
}

pub async fn upsert_person(args: UpdatePersonRequest) -> Result<GenericResponse, MinaError> {
  let result = search_library_element(&args.alias).await;
  if let Ok(found) = result {
    if found.is_some() {
      // The element exists, so we can update it
      let _ = update_person(args).await?;
      let response = GenericResponse {
        code: 0,
        message: SUCCESS_UPDATE_ELEMENT.to_string(),
      };
      return Ok(response);
    }
  }

  // The element does not exist, so we have to create it
  let mut vars = HashMap::new();
  vars.insert("alias".to_string(), args.alias.clone());
  vars.insert(
    "fields".to_string(),
    "new-label, new-person-type".to_string(),
  );
  if args.new_label.is_some() && args.new_person_type.is_some() {
    // All required fields have been passed, so we can proceed with the creation
    let create_args = CreatePersonRequest {
      alias: args.alias.clone(),
      label: args.new_label.unwrap(),
      person_type: args.new_person_type.unwrap(),
      description: args.new_description,
      notes: args.new_notes,
    };
    let _ = create_person(create_args).await?;
    let response = GenericResponse {
      code: 0,
      message: strfmt(SUCCESS_INSERT_ELEMENT_UPSERT, &vars).unwrap(),
    };
    return Ok(response);
  } else {
    // Some required fields have not been passed, so we cannot proceed with the creation
    return Err(MinaError {
      code: 1,
      msg: strfmt(ERROR_UPSERT_ELEMENT_MISSING_FIELDS, &vars).unwrap(),
    });
  }
}

pub async fn create_system(args: CreateSystemRequest) -> Result<(), MinaError> {
  let mut system = SoftwareSystem::default();
  system.base_data.uuid = Some(Uuid::new_v4().to_string());
  system.base_data.alias = Some(args.alias);
  system.base_data.description = args.description;
  system.base_data.label = Some(args.label);
  system.base_data.link = args.link;
  system.base_data.notes = args.notes;
  system.system_type = Some(args.system_type);

  create_element(&DiagramElementType::SoftwareSystem(system)).await?;
  return Ok(());
}

pub async fn update_system(update_system_args: UpdateSystemRequest) -> Result<(), MinaError> {
  let system = search_library_element(&update_system_args.alias).await?;
  if let Some(found_system) = system {
    if let DiagramElementType::SoftwareSystem(found_system) = found_system {
      let old_system = found_system.clone();
      let mut new_system = found_system.clone();

      if update_system_args.new_label.is_some() {
        new_system.base_data.label = update_system_args.new_label;
      }
      if update_system_args.new_system_type.is_some() {
        new_system.system_type = update_system_args.new_system_type;
      }
      if update_system_args.new_description.is_some() {
        new_system.base_data.description = update_system_args.new_description;
      }
      if update_system_args.new_link.is_some() {
        new_system.base_data.link = update_system_args.new_link;
      }
      if update_system_args.new_notes.is_some() {
        new_system.base_data.notes = update_system_args.new_notes;
      }

      update_element(
        &DiagramElementType::SoftwareSystem(old_system),
        &DiagramElementType::SoftwareSystem(new_system),
      )
      .await?;
      return Ok(());
    }
  }
  return Err(MinaError::new(
    -1,
    &format!(
      "Software System with alias \"{}\" not found.",
      &update_system_args.alias
    ),
  ));
}

pub async fn upsert_system(args: UpdateSystemRequest) -> Result<GenericResponse, MinaError> {
  let result = search_library_element(&args.alias).await;
  if let Ok(found) = result {
    if found.is_some() {
      // The element exists, so we can update it
      let _ = update_system(args).await?;
      let response = GenericResponse {
        code: 0,
        message: SUCCESS_UPDATE_ELEMENT.to_string(),
      };
      return Ok(response);
    }
  }

  // The element does not exist, so we have to create it
  let mut vars = HashMap::new();
  vars.insert("alias".to_string(), args.alias.clone());
  vars.insert(
    "fields".to_string(),
    "new-label, new-system-type".to_string(),
  );
  if args.new_label.is_some() && args.new_system_type.is_some() {
    // All required fields have been passed, so we can proceed with the creation
    let create_args = CreateSystemRequest {
      alias: args.alias.clone(),
      label: args.new_label.unwrap(),
      system_type: args.new_system_type.unwrap(),
      description: args.new_description,
      link: args.new_link,
      notes: args.new_notes,
    };
    let _ = create_system(create_args).await?;
    let response = GenericResponse {
      code: 0,
      message: strfmt(SUCCESS_INSERT_ELEMENT_UPSERT, &vars).unwrap(),
    };
    return Ok(response);
  } else {
    // Some required fields have not been passed, so we cannot proceed with the creation
    return Err(MinaError {
      code: 1,
      msg: strfmt(ERROR_UPSERT_ELEMENT_MISSING_FIELDS, &vars).unwrap(),
    });
  }
}
