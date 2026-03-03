pub mod models;

use anyhow::Result;
use keadex_mina::error_handling::mina_error::MinaError;
use keadex_mina::model::diagram::Diagram;
use keadex_mina::service::diagram_service::get_diagram;
use mina_cli::helpers::mina_lifecycle_helper::{clear_keadex_mina, init_keadex_mina};
use models::requests::read_local_diagram_request::ReadLocalDiagramRequest;
use rmcp::{
    ServerHandler, ServiceExt,
    handler::server::{router::tool::ToolRouter, tool::Parameters, wrapper::Json},
    model::*,
    tool, tool_handler, tool_router,
};
use std::path::PathBuf;

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
        description = "Retrieve the detailed data of a Keadex Mina architectural diagram for a specified diagram type and name within a local Keadex Mina project. This may include the raw PlantUML code, a JSON representation of the PlantUML code, metadata, and rendering data. Use this tool when you need to access the content of a Keadex Mina architectural diagram that describes a system or software architecture using the C4 Model. The diagram includes architectural components and their associated data (such as the GitHub repository, technology stack, and description), the relationships between these components, and links to other diagrams. Do not use this tool for remote Keadex Mina projects that have not been cloned locally."
    )]
    async fn read_local_diagram(
        &self,
        Parameters(ReadLocalDiagramRequest {
            mina_project_path,
            diagram_name,
            diagram_type,
        }): Parameters<ReadLocalDiagramRequest>,
    ) -> Result<Json<Diagram>, Json<MinaError>> {
        init_keadex_mina(&PathBuf::from(&mina_project_path))
            .await
            .map_err(|e| Json(e))?;
        let diagram = get_diagram(&diagram_name, diagram_type)
            .await
            .map_err(|e| Json(e))?;
        clear_keadex_mina(&PathBuf::from(&mina_project_path)).await;
        Ok(Json(diagram))
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
