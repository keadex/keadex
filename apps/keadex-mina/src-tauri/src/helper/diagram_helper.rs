/*!
Helper module which exports utilities for diagrams.
*/

#[cfg(feature = "desktop")]
use crate::core::app::ROOT_RESOLVER;
#[cfg(feature = "desktop")]
use crate::core::resolver::ResolvableModules::ProjectSettingsIMDAO;
use crate::dao::filesystem::diagram::diagram_plantuml_dao::FILE_NAME as DIAGRAM_PLANTUML_FILE_NAME;
use crate::dao::filesystem::diagram::diagram_spec_dao::FILE_NAME as DIAGRAM_SPEC_FILE_NAME;
use crate::dao::filesystem::diagram::DIAGRAMS_FOLDER;
#[cfg(feature = "desktop")]
use crate::dao::inmemory::InMemoryDAO;
use crate::error_handling::errors::{
  GENERIC_PARSING_ERROR_CODE, PARSING_DIAGRAM_PATH_ERROR_MSG, PROJECT_NOT_LOADED_ERROR_CODE,
  PROJECT_NOT_LOADED_ERROR_MSG,
};
use crate::error_handling::mina_error::MinaError;
#[cfg(feature = "desktop")]
use crate::helper::distribution_helper::dist_path;
use crate::model::c4_element::base_element::BaseElement;
use crate::model::diagram::diagram_plantuml::{DiagramElementType, DiagramPlantUML};
use crate::model::diagram::diagram_spec::DiagramSpec;
use crate::model::diagram::Diagram;
use crate::model::diagram::DiagramType;
#[cfg(feature = "desktop")]
use crate::resolve_to_write;
use convert_case::{Case, Casing};
#[cfg(feature = "desktop")]
use std::path::MAIN_SEPARATOR;
use std::str::FromStr;

/**
Returns a human-readable format of a diagram's name, starting from its folder's name.
Example: diagram-name -> Diagram name
# Arguments
  * `folder_name` - Folder of the diagram
*/
pub fn diagram_human_name_from_dir_name(folder_name: &str) -> String {
  folder_name.from_case(Case::Kebab).to_case(Case::Title)
}

/**
Returns the folder name of a a diagram, starting from its human-readable name.
Example: Diagram name -> diagram-name
# Arguments
  * `human_name` - Human-readable name of the diagram.
*/
pub fn diagram_dir_name_from_human_name(human_name: &str) -> String {
  human_name.from_case(Case::Title).to_case(Case::Kebab)
}

/**
Retrieves diagram's name and type starting from its path.
Example: <PROJECT_ROOT>/diagrams/<DIAGRAM_TYPE>/<DIAGRAM_NAME>/diagram.puml -> (<DIAGRAM_NAME>, <DIAGRAM_TYPE>)
# Arguments
  * `path` - Path to process
*/
#[cfg(feature = "desktop")]
pub fn diagram_name_type_from_path(path: &str) -> Result<(String, DiagramType), MinaError> {
  /*
  A diagram's path has the following syntax: "<PROJECT_ROOT>/diagrams/<DIAGRAM_TYPE>/<DIAGRAM_NAME>/diagram.puml"
  So I'm splitting the path two times. The first time to remove the "<PROJECT_ROOT>/diagrams/" part and the
  second time to extract DIAGRAM_TYPE and DIAGRAM_NAME.
  */
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO).get();
  if let None = project_settings {
    return Err(MinaError::new(
      PROJECT_NOT_LOADED_ERROR_CODE,
      PROJECT_NOT_LOADED_ERROR_MSG,
    ));
  }
  let project_root = project_settings.unwrap().root;
  let partial_path = &format!("{}{}", diagrams_path(project_root.as_str()), MAIN_SEPARATOR);
  let path_str = path.to_string();
  let mut res: Vec<&str> = path_str.split(partial_path).collect();
  if res.len() > 1 {
    res = res.get(1).unwrap().split(MAIN_SEPARATOR).collect();
    if res.len() > 2 {
      let diagram_type = diagram_type_from_folder_name(res.get(0).unwrap())?;
      return Ok((
        diagram_human_name_from_dir_name(res.get(1).unwrap()),
        diagram_type,
      ));
    }
  }
  Err(MinaError::new(
    GENERIC_PARSING_ERROR_CODE,
    PARSING_DIAGRAM_PATH_ERROR_MSG,
  ))
}

/**
Generates a diagram's type enum serialized with the uppercase snake format, e.g. "SYSTEM_LANDSCAPE",
"CONTAINER", etc. starting from the folder name in lowercase train format, e.g.: "system-landscape", "container", etc.
# Arguments
  * `type_str` - String representing a diagram's type in lowercase train format, e.g.: "system-landscape"
*/
pub fn diagram_type_from_folder_name(type_str: &str) -> Result<DiagramType, MinaError> {
  let parsed_diagram_type =
    DiagramType::from_str(&type_str.from_case(Case::Kebab).to_case(Case::UpperSnake));
  if let Err(error) = parsed_diagram_type {
    log::error!("{}", error);
    return Err(error.into());
  }
  Ok(parsed_diagram_type.unwrap())
}

/**
Generates the name of a folder's diagram, starting from its type.
Example: SYSTEM_CONTEXT -> system-name
# Arguments
  * `diagram_type` - Type of the diagram
*/
pub fn diagram_folder_name_from_type(diagram_type: &DiagramType) -> String {
  let serialized_diagram_type = diagram_type.to_string();
  serialized_diagram_type
    .from_case(Case::UpperSnake)
    .to_case(Case::Kebab)
}

/**
Utility which generates the path of diagrams by using the given separator.
Example: ROOT<SEPARATOR>diagrams
# Arguments
  * `root` - Root of the Mina project
  * `separator` - Separator
*/
pub fn diagrams_path_separator(root: &str, separator: char) -> String {
  format!("{}{}{}", root, separator, DIAGRAMS_FOLDER)
}

/**
Utility which generates the path of diagrams.
Example: ROOT/diagrams
# Arguments
  * `root` - Root of the Mina project
*/
#[cfg(feature = "desktop")]
pub fn diagrams_path(root: &str) -> String {
  diagrams_path_separator(root, MAIN_SEPARATOR)
}

/**
Utility which generates the path to the root directory which contains diagrams
of a specific type, by using the given separator: e.g., ROOT<SEPARATOR>diagrams<SEPARATOR>container
# Arguments
  * `root` - Root of the Mina project
  * `dir_type_name` - Name of the diagram's type directory
  * `separator` - Separator
*/
pub fn diagram_type_path_separator(root: &str, dir_type_name: &str, separator: char) -> String {
  format!(
    "{}{}{}",
    diagrams_path_separator(root, separator),
    separator,
    dir_type_name
  )
}

/**
Utility which generates the path to the root directory which contains diagrams
of a specific type: e.g., ROOT/diagrams/container
# Arguments
  * `root` - Root of the Mina project
  * `dir_type_name` - Name of the diagram's type directory
*/
#[cfg(feature = "desktop")]
pub fn diagram_type_path(root: &str, dir_type_name: &str) -> String {
  diagram_type_path_separator(root, dir_type_name, MAIN_SEPARATOR)
}

/**
Utility which generates the path of a diagram, starting from its name and type.
Example: ROOT/diagrams/container/diagram-name
# Arguments
  * `name` - Name of the diagram
  * `diagram_type` - Type of the diagram
*/
#[cfg(feature = "desktop")]
pub fn diagram_dir_path_from_name_type(
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO).get();
  if let None = project_settings {
    return Err(MinaError::new(
      PROJECT_NOT_LOADED_ERROR_CODE,
      PROJECT_NOT_LOADED_ERROR_MSG,
    ));
  }
  let project_root = project_settings.unwrap().root;
  let dir_name_diagram_type = diagram_folder_name_from_type(diagram_type);
  let diagram_type_path = diagram_type_path(&project_root, &dir_name_diagram_type);
  let dir_name_diagram_name = diagram_dir_name_from_human_name(diagram_name);
  Ok(format!(
    "{}{}{}",
    diagram_type_path, MAIN_SEPARATOR, dir_name_diagram_name
  ))
}

/**
Utility which generates the path of the PlantUML file of a diagram, starting from its name and type.
Example: ROOT/diagrams/container/diagram-name/diagram.puml
# Arguments
  * `name` - Name of the diagram
  * `diagram_type` - Type of the diagram
*/
#[cfg(feature = "desktop")]
pub fn diagram_plantuml_path_from_name_type(
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  Ok(format!(
    "{}{}{}",
    diagram_dir_path_from_name_type(diagram_name, diagram_type)?,
    MAIN_SEPARATOR,
    DIAGRAM_PLANTUML_FILE_NAME
  ))
}

/**
Utility which generates the path of the Spec file of a diagram, starting from its name and type.
Example: ROOT/diagrams/container/diagram-name/diagram.spec.json
# Arguments
  * `name` - Name of the diagram
  * `diagram_type` - Type of the diagram
*/
#[cfg(feature = "desktop")]
pub fn diagram_spec_path_from_name_type(
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  Ok(format!(
    "{}{}{}",
    diagram_dir_path_from_name_type(diagram_name, diagram_type)?,
    MAIN_SEPARATOR,
    DIAGRAM_SPEC_FILE_NAME
  ))
}

pub fn get_all_elements_aliases(elements: &Vec<DiagramElementType>) -> Vec<String> {
  let mut aliases: Vec<String> = vec![];

  // Explicitly add the legend since it is not coded into the PlantUML file
  aliases.push("legend".to_string());

  for element in elements.clone() {
    match element {
      DiagramElementType::Person(person) => {
        if let Some(alias) = person.base_data.alias {
          aliases.push(alias);
        }
      }
      DiagramElementType::SoftwareSystem(software_system) => {
        if let Some(alias) = software_system.base_data.alias {
          aliases.push(alias);
        }
      }
      DiagramElementType::Container(container) => {
        if let Some(alias) = container.base_data.alias {
          aliases.push(alias);
        }
      }
      DiagramElementType::Component(component) => {
        if let Some(alias) = component.base_data.alias {
          aliases.push(alias);
        }
      }
      DiagramElementType::Boundary(boundary) => {
        if let Some(alias) = boundary.base_data.alias {
          aliases.push(alias);
        }

        // remove the legend alias since it will be added again in the recursive call
        let sub_aliases = &mut get_all_elements_aliases(&boundary.sub_elements);
        let pos_legend_result = sub_aliases.iter().position(|r| r == "legend");
        if let Some(pos_legend) = pos_legend_result {
          sub_aliases.remove(pos_legend);
        }

        aliases.append(sub_aliases);
      }
      DiagramElementType::DeploymentNode(deployment_node) => {
        if let Some(alias) = deployment_node.base_data.alias {
          aliases.push(alias)
        }

        // remove the legend alias since it will be added again in the recursive call
        let sub_aliases = &mut get_all_elements_aliases(&deployment_node.sub_elements);
        let pos_legend_result = sub_aliases.iter().position(|r| r == "legend");
        if let Some(pos_legend) = pos_legend_result {
          sub_aliases.remove(pos_legend);
        }

        aliases.append(sub_aliases);
      }
      DiagramElementType::Relationship(relationship) => {
        if let Some(alias) = relationship.base_data.alias {
          aliases.push(alias)
        }
      }
      DiagramElementType::Include(_) => (),
      DiagramElementType::Comment(_) => (),
    }
  }
  aliases
}

#[cfg(feature = "desktop")]
pub fn clean_diagram_specs(
  diagram_plantuml: &DiagramPlantUML,
  diagram_spec: &DiagramSpec,
) -> DiagramSpec {
  let aliases = get_all_elements_aliases(&diagram_plantuml.elements);

  let cleaned_elements_specs = diagram_spec
    .clone()
    .elements_specs
    .into_iter()
    .filter(|diagram_element_spec| aliases.contains(&diagram_element_spec.alias.clone().unwrap()))
    .collect();

  let mut cleaned_diagram_spec = diagram_spec.clone();
  cleaned_diagram_spec.elements_specs = cleaned_elements_specs;

  cleaned_diagram_spec
}

/**
Utility which generates the path of a the distribution version of the diagram,
starting from its name and type.
Example: ROOT/dist/diagrams/container/diagram-name
# Arguments
  * `name` - Name of the diagram
  * `diagram_type` - Type of the diagram
*/
#[cfg(feature = "desktop")]
pub fn diagram_dist_dir_path_from_name_type(
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  let store = ROOT_RESOLVER.get().read().unwrap();
  let project_settings = resolve_to_write!(store, ProjectSettingsIMDAO).get();
  if let None = project_settings {
    return Err(MinaError::new(
      PROJECT_NOT_LOADED_ERROR_CODE,
      PROJECT_NOT_LOADED_ERROR_MSG,
    ));
  }
  let project_root = project_settings.unwrap().root;

  let dist_path = dist_path(&project_root);
  let diagram_dir_path = diagram_dir_path_from_name_type(diagram_name, diagram_type);

  Ok(format!(
    "{}{}",
    dist_path,
    diagram_dir_path.unwrap().replace(&project_root, "")
  ))
}

/**
Utility which generates a link from a diagram.
Example: container/diagram-name
# Arguments
  * `diagram_human_name` - Human name of the diagram
  * `diagram_type` - Type of the diagram
*/
#[cfg(feature = "desktop")]
pub fn diagram_to_link_string(
  diagram_human_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  let dir_name_diagram_name = diagram_dir_name_from_human_name(diagram_human_name);
  let dir_name_diagram_type = diagram_folder_name_from_type(diagram_type);

  Ok(format!(
    "{}/{}",
    dir_name_diagram_type, dir_name_diagram_name
  ))
}

/**
Utility which parse the link string (e.g. container/diagram-name)
to extract the diagram's name and type.
# Arguments
  * `link_string` - Diagram's link
*/
pub fn diagram_from_link_string(link_string: &str) -> Result<Diagram, MinaError> {
  let index_separator = link_string.find("/").unwrap();

  let diagram_human_name =
    diagram_human_name_from_dir_name(&link_string[index_separator + 1..link_string.len()]);
  let diagram_type = diagram_type_from_folder_name(&link_string[..index_separator])?;

  Ok(Diagram {
    diagram_name: Some(diagram_human_name),
    diagram_type: Some(diagram_type),
    diagram_spec: None,
    diagram_plantuml: None,
    raw_plantuml: None,
    last_modified: None,
    auto_layout: None,
  })
}

/**
Utility which deletes all the references of the given diagram, from the base data of a diagram's element.
# Arguments
  * `diagram_human_name` - Human name of the diagram to delete
  * `diagram_type` - Type of the diagram to delete
  * `base_data` - Base data of the diagram's element from which remove the references
*/
#[cfg(feature = "desktop")]
pub fn delete_references_from_base_data(
  diagram_human_name: &str,
  diagram_type: &DiagramType,
  base_data: &mut BaseElement,
) -> Result<(), MinaError> {
  let link_to_delete = diagram_to_link_string(diagram_human_name, diagram_type)?;

  // Remove link (if refenced)
  if base_data.link == Some(link_to_delete) {
    base_data.link = None;
  }

  Ok(())
}

/**
Retrieves diagram's name and type starting from a URL.
Example: <PROJECT_ROOT_URL>/diagrams/<DIAGRAM_TYPE>/<DIAGRAM_NAME>/diagram.puml -> (<DIAGRAM_NAME>, <DIAGRAM_TYPE>)
# Arguments
  * `project_root_url` - URL of the project's root
  * `diagram_url` - URL of the diagram
*/
pub fn diagram_name_type_from_url(
  project_root_url: &str,
  diagram_url: &str,
) -> Result<(String, DiagramType), MinaError> {
  /*
  A diagram's path has the following syntax: "<PROJECT_ROOT>/diagrams/<DIAGRAM_TYPE>/<DIAGRAM_NAME>/diagram.puml"
  So I'm splitting the path two times. The first time to remove the "<PROJECT_ROOT>/diagrams/" part and the
  second time to extract DIAGRAM_TYPE and DIAGRAM_NAME.
  */
  let partial_path = &format!("{}{}", diagrams_path_separator(project_root_url, '/'), "/");
  let path_str = format!("{}{}{}", diagram_url, "/", DIAGRAM_PLANTUML_FILE_NAME);
  let mut res: Vec<&str> = path_str.split(partial_path).collect();
  if res.len() > 1 {
    res = res.get(1).unwrap().split("/").collect();
    if res.len() > 2 {
      let diagram_type = diagram_type_from_folder_name(res.get(0).unwrap())?;
      return Ok((
        diagram_human_name_from_dir_name(res.get(1).unwrap()),
        diagram_type,
      ));
    }
  }
  Err(MinaError::new(
    GENERIC_PARSING_ERROR_CODE,
    PARSING_DIAGRAM_PATH_ERROR_MSG,
  ))
}

/**
Utility which generates the URL of a diagram, starting from its name and type.
Example: <PROJECT_ROOT_URL>/diagrams/<DIAGRAM_TYPE>/<DIAGRAM_NAME>
# Arguments
  * `project_root_url` - URL of the project's root
  * `name` - Name of the diagram
  * `diagram_type` - Type of the diagram
*/
pub fn diagram_url_from_name_type(
  project_root_url: &str,
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  let dir_name_diagram_type = diagram_folder_name_from_type(diagram_type);
  let path_diagram_type =
    diagram_type_path_separator(&project_root_url, &dir_name_diagram_type, '/');
  let dir_name_diagram_name = diagram_dir_name_from_human_name(diagram_name);
  Ok(format!("{}/{}", path_diagram_type, dir_name_diagram_name))
}

/**
Utility which generates the URL of the PlantUML file of a diagram, starting from its name and type.
Example: <PROJECT_ROOT_URL>/diagrams/container/diagram-name/diagram.puml
# Arguments
  * `project_root_url` - URL of the project's root
  * `name` - Name of the diagram
  * `diagram_type` - Type of the diagram
*/
pub fn diagram_plantuml_url_from_name_type(
  project_root_url: &str,
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  Ok(format!(
    "{}/{}",
    diagram_url_from_name_type(project_root_url, diagram_name, diagram_type)?,
    DIAGRAM_PLANTUML_FILE_NAME
  ))
}

/**
Utility which generates the URL of the Spec file of a diagram, starting from its name and type.
Example: <PROJECT_ROOT_URL>/diagrams/container/diagram-name/diagram.spec.json
# Arguments
  * `name` - Name of the diagram
  * `diagram_type` - Type of the diagram
*/
pub fn diagram_spec_url_from_name_type(
  project_root_url: &str,
  diagram_name: &str,
  diagram_type: &DiagramType,
) -> Result<String, MinaError> {
  Ok(format!(
    "{}/{}",
    diagram_url_from_name_type(project_root_url, diagram_name, diagram_type)?,
    DIAGRAM_SPEC_FILE_NAME
  ))
}

pub fn diagram_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  let diagram = diagram_from_link_string(link_string)?;
  let diagram_url = diagram_url_from_name_type(
    &project_root_url,
    &diagram.diagram_name.unwrap(),
    &diagram.diagram_type.unwrap(),
  )?;
  Ok(diagram_url)
}

pub fn diagram_plantuml_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  let diagram = diagram_from_link_string(link_string)?;
  diagram_plantuml_url_from_name_type(
    project_root_url,
    &diagram.diagram_name.unwrap(),
    &diagram.diagram_type.unwrap(),
  )
}

pub fn diagram_spec_url_from_link_string(
  project_root_url: &str,
  link_string: &str,
) -> Result<String, MinaError> {
  let diagram = diagram_from_link_string(link_string)?;
  diagram_spec_url_from_name_type(
    project_root_url,
    &diagram.diagram_name.unwrap(),
    &diagram.diagram_type.unwrap(),
  )
}

pub fn diagram_plantuml_url_from_diagram_url(
  project_root_url: &str,
  diagram_url: &str,
) -> Result<String, MinaError> {
  let (diagram_name, diagram_type) = diagram_name_type_from_url(project_root_url, diagram_url)?;
  diagram_plantuml_url_from_name_type(project_root_url, &diagram_name, &diagram_type)
}

pub fn diagram_spec_url_from_diagram_url(
  project_root_url: &str,
  diagram_url: &str,
) -> Result<String, MinaError> {
  let (diagram_name, diagram_type) = diagram_name_type_from_url(project_root_url, diagram_url)?;
  diagram_spec_url_from_name_type(project_root_url, &diagram_name, &diagram_type)
}

/**
Utility which cleans the given PlantUML string from useless chars (new lines, leading and trailing spaces)
# Arguments
  * `plantuml_string` - PlantUML string to clean
*/
pub fn clean_plantuml_diagram_element(plantuml_string: &str) -> Result<String, MinaError> {
  Ok(plantuml_string.trim().replace(r"\n", ""))
}
