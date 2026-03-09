pub mod models;
pub mod services;
pub mod tools;

use crate::models::requests::local_project_base_request::LocalProjectBaseRequest;
use crate::models::responses::list_local_diagrams_response::ListLocalDiagramsResponse;
use crate::models::responses::read_all_local_diagrams_response::ReadAllLocalDiagramsResponse;
use crate::tools::local_diagrams_tools::list_diagrams_tool;
use crate::tools::local_diagrams_tools::read_all_diagrams_tool;
use crate::tools::local_diagrams_tools::read_diagram_tool;
use crate::tools::local_diagrams_tools::render_diagram_tool;
use anyhow::Result;
use keadex_mina::model::diagram::Diagram;
use models::requests::read_local_diagram_request::ReadLocalDiagramRequest;
use rmcp::{
  Json, ServerHandler, ServiceExt,
  handler::server::{router::tool::ToolRouter, wrapper::Parameters},
  model::*,
  tool, tool_handler, tool_router,
  transport::stdio,
};

#[derive(Clone)]
pub struct KeadexMinaServer {
  tool_router: ToolRouter<KeadexMinaServer>,
}

#[tool_router]
impl KeadexMinaServer {
  fn new() -> Self {
    Self {
      tool_router: Self::tool_router(),
    }
  }

  #[tool(
    description = "Retrieve the detailed data of a Keadex Mina architectural diagram for a specified diagram type and name within a local Keadex Mina project. This may include the raw PlantUML code, a JSON representation of the PlantUML code, metadata, and rendering data. Use this tool when you need to access the content of a Keadex Mina architectural diagram that describes a system or software architecture using the C4 Model. The diagram includes architectural components and their associated data (such as the GitHub repository, technology stack, and description), the relationships between these components, and links to other diagrams. Links to other diagrams are identified using the PlantUML syntax: `$link=\"<DIAGRAM_TYPE>/<DIAGRAM_NAME>\"`. Links may also include external URLs, for example: `$link=\"<DIAGRAM_TYPE>/<DIAGRAM_NAME>;http://host1.domain;https://host2.domain\"`. Do not use this tool for remote Keadex Mina projects that have not been cloned locally.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn read_local_diagram(
    &self,
    Parameters(request): Parameters<ReadLocalDiagramRequest>,
  ) -> Result<Json<Diagram>, String> {
    read_diagram_tool(self, request).await
  }

  #[tool(
    description = "Retrieve the list of diagrams in a local Keadex Mina project. Use this tool when you need to list all the architectural diagrams present in a Keadex Mina project. More specifically, this tool returns a map where the keys are the C4 Model diagram types and the values are vectors of strings representing the names of the diagrams. Do not use this tool for remote Keadex Mina projects that have not been cloned locally.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn list_local_diagrams(
    &self,
    Parameters(request): Parameters<LocalProjectBaseRequest>,
  ) -> Result<Json<ListLocalDiagramsResponse>, String> {
    list_diagrams_tool(self, &request.mina_project_path).await
  }

  #[tool(
    description = "Read all architectural diagrams in a local Keadex Mina project. Use this tool when you need to access all the architectural diagrams present in a Keadex Mina project, which describe various aspects of one or more systems or software applications. More specifically, this tool returns a vector of diagrams that include architectural components and their associated data (such as the GitHub repository, technology stack, and description), the relationships between these components, and links to other diagrams. Do not use this tool for remote Keadex Mina projects that have not been cloned locally.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn read_all_local_diagrams(
    &self,
    Parameters(request): Parameters<LocalProjectBaseRequest>,
  ) -> Result<Json<ReadAllLocalDiagramsResponse>, String> {
    read_all_diagrams_tool(self, &request.mina_project_path).await
  }

  #[tool(
    description = "Render an architectural diagram from a local Keadex Mina project as SVG. Use this tool when you need to render and provide a visual preview of an architectural diagram present in a Keadex Mina project, which describes various aspects of one or more systems or software applications. More specifically, this tool returns an SVG containing the rendered diagram. When invoking this tool, do not print the SVG as text; instead, render it as an image. Do not use this tool for remote Keadex Mina projects that have not been cloned locally.",
    annotations(
      read_only_hint = true,
      destructive_hint = false,
      idempotent_hint = true
    )
  )]
  async fn render_local_diagram(
    &self,
    Parameters(request): Parameters<ReadLocalDiagramRequest>,
  ) -> Result<Annotated<RawContent>, String> {
    render_diagram_tool(self, request).await
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
  //   let transport = (tokio::io::stdin(), tokio::io::stdout());
  //   let service = KeadexMinaServer::new().serve(transport).await?;
  //   service.waiting().await?;
  //   Ok(())

  let service = KeadexMinaServer::new().serve(stdio()).await?;
  service.waiting().await?;

  Ok(())
}
