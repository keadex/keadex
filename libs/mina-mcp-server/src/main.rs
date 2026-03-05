pub mod models;
pub mod tools;

use crate::tools::local_diagrams_tools::list_diagrams_tool;
use crate::tools::local_diagrams_tools::read_diagram_tool;
use anyhow::Result;
use keadex_mina::model::diagram::Diagram;
use keadex_mina::{error_handling::mina_error::MinaError, model::diagram::DiagramType};
use models::requests::read_local_diagram_request::ReadLocalDiagramRequest;
use rmcp::{
  ServerHandler, ServiceExt,
  handler::server::{router::tool::ToolRouter, tool::Parameters, wrapper::Json},
  model::*,
  tool, tool_handler, tool_router,
};
use std::collections::HashMap;

pub struct KeadexMina {
  tool_router: ToolRouter<KeadexMina>,
}

#[tool_router]
impl KeadexMina {
  fn new() -> Self {
    Self {
      tool_router: Self::tool_router(),
    }
  }

  #[tool(
    description = "Retrieve the detailed data of a Keadex Mina architectural diagram for a specified diagram type and name within a local Keadex Mina project. This may include the raw PlantUML code, a JSON representation of the PlantUML code, metadata, and rendering data. Use this tool when you need to access the content of a Keadex Mina architectural diagram that describes a system or software architecture using the C4 Model. The diagram includes architectural components and their associated data (such as the GitHub repository, technology stack, and description), the relationships between these components, and links to other diagrams. Links to other diagrams are identified using the PlantUML syntax: `$link=\"<DIAGRAM_TYPE>/<DIAGRAM_NAME>\"`. Links may also include external URLs, for example: `$link=\"<DIAGRAM_TYPE>/<DIAGRAM_NAME>;http://host1.domain;https://host2.domain\"`. Do not use this tool for remote Keadex Mina projects that have not been cloned locally."
  )]
  async fn read_local_diagram(
    &self,
    Parameters(request): Parameters<ReadLocalDiagramRequest>,
  ) -> Result<Json<Diagram>, Json<MinaError>> {
    read_diagram_tool(self, request).await
  }

  #[tool(
    description = "Retrieve the list of diagrams in a local Keadex Mina project. Use this tool when you need to list all the architectural diagrams present in a Keadex Mina project. More specifically, this tool returns a map where the keys are the C4 Model diagram types and the values are vectors of strings representing the names of the diagrams. Do not use this tool for remote Keadex Mina projects that have not been cloned locally."
  )]
  async fn list_local_diagrams(
    &self,
    Parameters(request): Parameters<ReadLocalDiagramRequest>,
  ) -> Result<Json<HashMap<DiagramType, Vec<String>>>, Json<MinaError>> {
    list_diagrams_tool(self, request).await
  }
}

#[tool_handler]
impl ServerHandler for KeadexMina {
  fn get_info(&self) -> ServerInfo {
    ServerInfo {
      capabilities: ServerCapabilities::builder().enable_tools().build(),
      ..Default::default()
    }
  }
}

#[tokio::main]
async fn main() -> Result<()> {
  let transport = (tokio::io::stdin(), tokio::io::stdout());
  let service = KeadexMina::new().serve(transport).await?;
  service.waiting().await?;
  Ok(())
}
