pub mod constants;
pub mod core;
pub mod models;
pub mod services;
pub mod tools;

use crate::core::node_bridge::NodeBridge;
use crate::core::server::KeadexMinaServer;
use crate::models::requests::create_diagram_request::CreateDiagramRequest;
use crate::models::requests::create_project_request::CreateProjectRequest;
use crate::models::requests::diagram_element_request::DiagramElementRequest;
use crate::models::requests::edit_plantuml_request::EditPlantUmlRequest;
use crate::models::requests::find_diagram_element_request::FindDiagramElementRequest;
use crate::models::requests::generate_plantuml_code_diagram_request::GeneratePlantUmlCodeDiagramRequest;
use crate::models::requests::generate_plantuml_code_elements_request::GeneratePlantUmlCodeElementsRequest;
use crate::models::requests::local_diagram_base_request::LocalDiagramBaseRequest;
use crate::models::requests::local_project_base_request::LocalProjectBaseRequest;
use crate::models::requests::read_remote_diagram_request::ReadRemoteDiagramRequest;
use crate::models::requests::search_and_replace_request::SearchAndReplaceRequest;
use crate::models::requests::update_component_request::UpdateComponentRequest;
use crate::models::requests::update_container_request::UpdateContainerRequest;
use crate::models::requests::update_person_request::UpdatePersonRequest;
use crate::models::requests::update_system_request::UpdateSystemRequest;
use crate::models::requests::validate_plantuml_code_request::ValidatePlantUmlCodeRequest;
use crate::models::responses::base_response::BaseResponse;
use crate::models::responses::found_element_response::FoundElementResponse;
use crate::models::responses::found_elements_response::FoundElementsResponse;
use crate::models::responses::list_local_diagrams_response::ListLocalDiagramsResponse;
use crate::models::responses::read_all_local_diagrams_response::ReadAllLocalDiagramsResponse;
use crate::services::project_service::ensure_project_is_open;
use crate::tools::local_diagrams_tools::create_diagram_tool;
use crate::tools::local_diagrams_tools::delete_diagram_tool;
use crate::tools::local_diagrams_tools::edit_diagram_plantuml_code_tool;
use crate::tools::local_diagrams_tools::find_dependent_elements_in_diagram_tool;
use crate::tools::local_diagrams_tools::list_diagrams_tool;
use crate::tools::local_diagrams_tools::read_all_diagrams_tool;
use crate::tools::local_diagrams_tools::read_diagram_tool as read_local_diagram_tool;
use crate::tools::local_diagrams_tools::render_diagram_tool as render_local_diagram_tool;
use crate::tools::local_diagrams_tools::search_diagram_element_in_project;
use crate::tools::local_diagrams_tools::validate_diagram_tool;
use crate::tools::local_library_tools::list_library_elements_tool;
use crate::tools::local_library_tools::search_diagram_element_in_library_tool;
use crate::tools::local_library_tools::upsert_component_in_library_tool;
use crate::tools::local_library_tools::upsert_container_in_library_tool;
use crate::tools::local_library_tools::upsert_person_in_library_tool;
use crate::tools::local_library_tools::upsert_system_in_library_tool;
use crate::tools::local_project_tools::close_project_tool;
use crate::tools::local_project_tools::create_project_tool;
use crate::tools::local_project_tools::open_project_tool;
use crate::tools::local_project_tools::search_and_replace_in_project_tool;
use crate::tools::local_project_tools::validate_project_tool;
use crate::tools::plantuml_code_tools::generate_plantuml_code_of_diagram_elements_tool;
use crate::tools::plantuml_code_tools::generate_plantuml_code_of_diagram_tool;
use crate::tools::plantuml_code_tools::validate_diagram_plantuml_code_tool;
use crate::tools::remote_diagrams_tools::read_diagram_tool as read_remote_diagram_tool;
use crate::tools::remote_diagrams_tools::render_diagram_tool as render_remote_diagram_tool;
use anyhow::Result;
use keadex_mina::model::c4_element::C4Elements;
use keadex_mina::model::diagram::Diagram;
use keadex_mina::model::diagram_element_search_results::DiagramElementSearchResults;
use keadex_mina::model::file_search_results::FileSearchResults;
use keadex_mina::model::project::Project;
use keadex_mina::model::project_library::ProjectLibrary;
use keadex_mina::model::project_settings::ProjectSettings;
use rmcp::{
  Json, ServerHandler, ServiceExt, handler::server::wrapper::Parameters, model::*, tool,
  tool_handler, tool_router, transport::stdio,
};

#[tool_router]
impl KeadexMinaServer {
  fn new() -> Self {
    Self {
      tool_router: Self::tool_router(),
    }
  }

  // *************************************************
  // Tools for local diagrams
  // *************************************************
  #[tool(
    description = "Retrieve the detailed data of a Keadex Mina architectural diagram for a specified diagram type and name within a local Keadex Mina project. This may include the raw PlantUML code, a JSON representation of the PlantUML code, metadata, and rendering data. Use this tool when you need to access the content of a Keadex Mina architectural diagram that describes a system or software architecture using the C4 Model. The diagram includes architectural components and their associated data (such as the GitHub repository, technology stack, and description), the relationships between these components, and links to other diagrams. Links to other diagrams are identified using the PlantUML syntax: `$link=\"<DIAGRAM_TYPE>/<DIAGRAM_NAME>\"`. Links may also include external URLs, for example: `$link=\"<DIAGRAM_TYPE>/<DIAGRAM_NAME>;http://host1.domain;https://host2.domain\"`. Do not use this tool for remote Keadex Mina projects that have not been cloned locally. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn read_local_diagram(
    &self,
    Parameters(request): Parameters<LocalDiagramBaseRequest>,
  ) -> Result<Json<Diagram>, String> {
    ensure_project_is_open().await?;
    read_local_diagram_tool(self, request).await
  }

  #[tool(
    description = "Retrieve the list of diagrams in a local Keadex Mina project. Use this tool when you need to list all the architectural diagrams present in a Keadex Mina project. More specifically, this tool returns a map where the keys are the C4 Model diagram types and the values are vectors of strings representing the names of the diagrams. Do not use this tool for remote Keadex Mina projects that have not been cloned locally. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn list_local_diagrams(&self) -> Result<Json<ListLocalDiagramsResponse>, String> {
    ensure_project_is_open().await?;
    list_diagrams_tool(self).await
  }

  #[tool(
    description = "Read all architectural diagrams in a local Keadex Mina project. Use this tool when you need to access all the architectural diagrams present in a Keadex Mina project, which describe various aspects of one or more systems or software applications. More specifically, this tool returns a vector of diagrams that include architectural components and their associated data (such as the GitHub repository, technology stack, and description), the relationships between these components, and links to other diagrams. Do not use this tool for remote Keadex Mina projects that have not been cloned locally. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn read_all_local_diagrams(&self) -> Result<Json<ReadAllLocalDiagramsResponse>, String> {
    ensure_project_is_open().await?;
    read_all_diagrams_tool(Some(self)).await
  }

  #[tool(
    description = "Render an architectural diagram from a local Keadex Mina project as SVG. Use this tool when you need to render and provide a visual preview of an architectural diagram present in a Keadex Mina project, which describes various aspects of one or more systems or software applications. More specifically, this tool returns an SVG containing the rendered diagram. When invoking this tool, do not print the SVG as text; instead, render it as an image. Do not use this tool for remote Keadex Mina projects that have not been cloned locally. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn render_local_diagram(
    &self,
    Parameters(request): Parameters<LocalDiagramBaseRequest>,
  ) -> Result<Annotated<RawContent>, String> {
    ensure_project_is_open().await?;
    render_local_diagram_tool(self, request).await
  }

  #[tool(
    description = "Opens an existing Keadex Mina project on the local filesystem. Use this tool when you need to access and work with a local Keadex Mina project that has already been created. Do NOT use this tool to open remote Keadex Mina projects. Takes in input the path to the project directory. On success, returns the configuration of the opened project including its name, description, settings, and library configuration.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn open_local_project(
    &self,
    Parameters(request): Parameters<LocalProjectBaseRequest>,
  ) -> Result<Json<Project>, String> {
    open_project_tool(self, request).await
  }

  #[tool(
    description = "Closes an open Keadex Mina project on the local filesystem. Use this tool when you need to close a local Keadex Mina project that is currently open. Do NOT use this tool to close remote Keadex Mina projects. Takes in input the path to the project directory. On success, returns a confirmation of the project closure.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn close_local_project(
    &self,
    Parameters(request): Parameters<LocalProjectBaseRequest>,
  ) -> Result<Json<BaseResponse>, String> {
    close_project_tool(self, request).await
  }

  #[tool(
    description = "Creates a new Keadex Mina project on the local filesystem by writing a new folder containing the base project structure required to manage C4 Model architectural diagrams. Use this tool when you need to initialize a new local Keadex Mina project from scratch. Do NOT use this tool to create remote Keadex Mina projects. Takes in input the settings of the new project, including: project name, description, AI settings, theme settings, autosave preferences, and other project-level configuration. On success, returns the configuration of the newly created project including the path of its folder.",
    annotations(
      read_only_hint = false,
      destructive_hint = false,
      idempotent_hint = false
    )
  )]
  async fn create_local_project(
    &self,
    Parameters(request): Parameters<CreateProjectRequest>,
  ) -> Result<Json<ProjectSettings>, String> {
    create_project_tool(Some(self), request).await
  }

  #[tool(
    description = "Validates an existing Keadex Mina project on the local filesystem. Use this tool when you need to verify the integrity and configuration of a local Keadex Mina project. Do NOT use this tool to validate remote Keadex Mina projects. Takes in input the path to the project directory. On success, returns an empty result indicating the project is valid.",
    annotations(
      read_only_hint = false,
      destructive_hint = false,
      idempotent_hint = false
    )
  )]
  async fn validate_local_project(
    &self,
    Parameters(request): Parameters<LocalProjectBaseRequest>,
  ) -> Result<(), String> {
    validate_project_tool(Some(self), request).await
  }

  #[tool(
    description = "Searches for a specific element within the diagrams of a local Keadex Mina project. Use this tool when you need to locate a particular architectural element across the diagrams in a local project. Takes in input the alias of the diagram element to search for. Returns a list of all matching elements found. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn search_diagram_element_in_local_project(
    &self,
    Parameters(request): Parameters<DiagramElementRequest>,
  ) -> Result<Json<DiagramElementSearchResults>, String> {
    ensure_project_is_open().await?;
    search_diagram_element_in_project(self, request).await
  }

  #[tool(
    description = "Performs a search and replace operation for a specific text across the diagrams of a local Keadex Mina project. Use this tool when you need to update a particular architectural element or any text across the diagrams in a local project. Takes in input the text to search for, the replacement text, and options to include/exclude diagrams and library files. Returns a list of replaced occurrences. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = false,
      destructive_hint = true,
      idempotent_hint = false
    )
  )]
  async fn search_and_replace_in_local_project(
    &self,
    Parameters(request): Parameters<SearchAndReplaceRequest>,
  ) -> Result<Json<FileSearchResults>, String> {
    ensure_project_is_open().await?;
    search_and_replace_in_project_tool(self, request).await
  }

  #[tool(
    description = "Creates a new architectural diagram in a local Keadex Mina project. Use this tool when you need to add a new diagram to a local project. Takes in input the details of the diagram to create, including its type, name, content, and optionally metadata such as description and technology stack. The diagram name and type are required. On success, returns a confirmation of the diagram creation. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = false,
      destructive_hint = true,
      idempotent_hint = false
    )
  )]
  async fn create_local_diagram(
    &self,
    Parameters(request): Parameters<CreateDiagramRequest>,
  ) -> Result<Json<BaseResponse>, String> {
    ensure_project_is_open().await?;
    create_diagram_tool(Some(self), request).await
  }

  #[tool(
    description = "Deletes an architectural diagram from a local Keadex Mina project. Use this tool when you need to remove an existing diagram from a local project. Takes in input the identifier of the diagram to delete, such as its type and name. On success, returns the updated project library configuration reflecting the deletion of the diagram. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = false,
      destructive_hint = true,
      idempotent_hint = false
    )
  )]
  async fn delete_local_diagram(
    &self,
    Parameters(request): Parameters<LocalDiagramBaseRequest>,
  ) -> Result<Json<ProjectLibrary>, String> {
    ensure_project_is_open().await?;
    delete_diagram_tool(Some(self), request).await
  }

  #[tool(
    description = "Edits the PlantUML code of an existing architectural diagram in a local Keadex Mina project. Use this tool when you need to modify the PlantUML code of a diagram within a local project. Takes in input the name, type and specification of the diagram to edit and the new PlantUML code. On success, returns the updated diagram. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = false,
      destructive_hint = true,
      idempotent_hint = false
    )
  )]
  async fn edit_local_diagram_plantuml_code(
    &self,
    Parameters(request): Parameters<EditPlantUmlRequest>,
  ) -> Result<Json<Diagram>, String> {
    ensure_project_is_open().await?;
    edit_diagram_plantuml_code_tool(self, request).await
  }

  #[tool(
    description = "Validates an architectural diagram in a local Keadex Mina project. Use this tool when you need to verify the integrity and correctness of a diagram within a local project. Takes in input the name and type of the diagram to validate. On success, returns a value indicating whether the diagram is valid or not. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn validate_local_diagram(
    &self,
    Parameters(request): Parameters<LocalDiagramBaseRequest>,
  ) -> Result<Json<BaseResponse>, String> {
    ensure_project_is_open().await?;
    validate_diagram_tool(self, request).await
  }

  #[tool(
    description = "Finds all elements in a local Keadex Mina diagram that depend on an element with the given alias. Use this tool when you need to identify dependencies between architectural elements within a local diagram. Takes in input the alias of the diagram element to find dependencies for, and the name and type of the diagram to search within. Returns a list of all elements that depend on the specified element. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn find_dependent_elements_in_local_diagram(
    &self,
    Parameters(request): Parameters<FindDiagramElementRequest>,
  ) -> Result<Json<FoundElementsResponse>, String> {
    ensure_project_is_open().await?;
    find_dependent_elements_in_diagram_tool(self, request).await
  }

  #[tool(
    description = "Lists all elements in the library of a local Keadex Mina project. Use this tool when you need to access the architectural elements available in the library of a local project. Takes in input no parameters. Returns a list of all elements in the project library, including their aliases and associated data. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn list_local_library_elements(&self) -> Result<Json<C4Elements>, String> {
    ensure_project_is_open().await?;
    list_library_elements_tool(self).await
  }

  #[tool(
    description = "Searches for a specific element in the library of a local Keadex Mina project. Use this tool when you need to find a particular architectural element within the library of a local project. Takes in input the alias of the element to search for. Returns the details of the found element, or null if not found. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn search_diagram_element_in_local_library(
    &self,
    Parameters(request): Parameters<DiagramElementRequest>,
  ) -> Result<Json<FoundElementResponse>, String> {
    ensure_project_is_open().await?;
    search_diagram_element_in_library_tool(self, request).await
  }

  #[tool(
    description = "Upserts a person in the local Keadex Mina library. Use this tool when you need to add or update a C4 person in the library of a local project. Takes in input the details of the person to upsert. On success, returns a confirmation of the operation. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = false,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn upsert_person_in_local_library(
    &self,
    Parameters(request): Parameters<UpdatePersonRequest>,
  ) -> Result<Json<BaseResponse>, String> {
    ensure_project_is_open().await?;
    upsert_person_in_library_tool(self, request).await
  }

  #[tool(
    description = "Upserts a system in the local Keadex Mina library. Use this tool when you need to add or update a C4 system in the library of a local project. Takes in input the details of the system to upsert. On success, returns a confirmation of the operation. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = false,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn upsert_system_in_local_library(
    &self,
    Parameters(request): Parameters<UpdateSystemRequest>,
  ) -> Result<Json<BaseResponse>, String> {
    ensure_project_is_open().await?;
    upsert_system_in_library_tool(self, request).await
  }

  #[tool(
    description = "Upserts a container in the local Keadex Mina library. Use this tool when you need to add or update a C4 container in the library of a local project. Takes in input the details of the container to upsert. On success, returns a confirmation of the operation. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = false,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn upsert_container_in_local_library(
    &self,
    Parameters(request): Parameters<UpdateContainerRequest>,
  ) -> Result<Json<BaseResponse>, String> {
    ensure_project_is_open().await?;
    upsert_container_in_library_tool(self, request).await
  }

  #[tool(
    description = "Upserts a component in the local Keadex Mina library. Use this tool when you need to add or update a C4 component in the library of a local project. Takes in input the details of the component to upsert. On success, returns a confirmation of the operation. This tool requires the project to be already opened.",
    annotations(
      read_only_hint = false,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn upsert_component_in_local_library(
    &self,
    Parameters(request): Parameters<UpdateComponentRequest>,
  ) -> Result<Json<BaseResponse>, String> {
    ensure_project_is_open().await?;
    upsert_component_in_library_tool(self, request).await
  }

  #[tool(
    description = "Generates the PlantUML code of a diagram based on its elements. Use this tool when you need to generate the PlantUML code of an architectural diagram based on the elements that compose it. Takes in input the identifier of the diagram (if any) and the list of its elements. On success, returns the generated PlantUML code.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn generate_plantuml_code_of_diagram(
    &self,
    Parameters(request): Parameters<GeneratePlantUmlCodeDiagramRequest>,
  ) -> Result<String, String> {
    generate_plantuml_code_of_diagram_tool(self, request).await
  }

  #[tool(
    description = "Generates the PlantUML code of one or more diagram elements. Use this tool when you need to generate the PlantUML code for a specific set of architectural elements, for example to add to an existing diagram the PlantUML code of those elements. Takes in input the list of diagram elements to generate the PlantUML code for, and optionally an indentation level to apply to the generated code. On success, returns the generated PlantUML code.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn generate_plantuml_code_of_diagram_elements(
    &self,
    Parameters(request): Parameters<GeneratePlantUmlCodeElementsRequest>,
  ) -> Result<String, String> {
    generate_plantuml_code_of_diagram_elements_tool(self, request).await
  }

  #[tool(
    description = "Validates the syntax of a given diagram's PlantUML code snippet. Use this tool when you need to verify the correctness of a diagram's PlantUML code, for example before using it to edit or create a diagram. Takes in input the PlantUML code to validate. On success, returns an empty result indicating the code is valid.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn validate_diagram_plantuml_code(
    &self,
    Parameters(request): Parameters<ValidatePlantUmlCodeRequest>,
  ) -> Result<(), String> {
    validate_diagram_plantuml_code_tool(self, request).await
  }

  // *************************************************
  // Tools for remote diagrams
  // *************************************************

  #[tool(
    description = "Retrieves detailed data for a specific architectural diagram from a remote Keadex Mina project hosted in a GitHub repository. Use this tool to inspect or reason about a Keadex Mina C4 Model diagram, including its components, relationships, and links to other diagrams. Do NOT use this tool for locally cloned Mina projects. Inputs: the GitHub raw URL of the project root, the GitHub raw URL of the target diagram, and optionally a GitHub token for private repositories. Returns any combination of: raw PlantUML source, a JSON representation of the PlantUML AST, diagram metadata, and rendering data. Diagram content includes architectural components and their data (description, technology stack, linked GitHub repository), relationships between components, and links to other diagrams expressed in PlantUML as: $link=\"<DIAGRAM_TYPE>/<DIAGRAM_NAME>\". Links may also include external URLs: $link=\"<DIAGRAM_TYPE>/<DIAGRAM_NAME>;http://host1.domain;https://host2.domain\".",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn read_remote_diagram(
    &self,
    Parameters(request): Parameters<ReadRemoteDiagramRequest>,
  ) -> Result<Json<Diagram>, String> {
    let diagram_data = read_remote_diagram_tool(self, request).await?;
    match diagram_data {
      Some((diagram, _)) => Ok(Json(diagram)),
      None => Err("Diagram not found. Please verify the URLs provided, or, if linking to a private repository, ensure the GitHub token is configured.".to_string()),        
    }
  }

  #[tool(
    description = "Render an architectural diagram from a remote Keadex Mina project as SVG. Use this tool when you need to render and provide a visual preview of an architectural diagram present in a Keadex Mina project, which describes various aspects of one or more systems or software applications. More specifically, this tool returns an SVG containing the rendered diagram. When invoking this tool, do not print the SVG as text; instead, render it as an image. Do not use this tool for local Keadex Mina projects that have been cloned locally.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn render_remote_diagram(
    &self,
    Parameters(request): Parameters<ReadRemoteDiagramRequest>,
  ) -> Result<Annotated<RawContent>, String> {
    render_remote_diagram_tool(self, request).await
  }
}

#[tool_handler]
impl ServerHandler for KeadexMinaServer {
  fn get_info(&self) -> ServerInfo {
    let mut info = ServerInfo::default();
    info.capabilities = ServerCapabilities::builder().enable_tools().build();
    info
  }
}

#[tokio::main]
async fn main() -> Result<()> {
  // Initialize once at startup the Nodejs bridge and make it globally available
  NodeBridge::init();

  // Initialize Keadex Mina app
  let _app = keadex_mina::core::app::App::new();

  let service = KeadexMinaServer::new().serve(stdio()).await?;
  service.waiting().await?;

  Ok(())
}
