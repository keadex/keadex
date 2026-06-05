use rmcp::handler::server::router::tool::ToolRouter;

#[derive(Clone)]
pub struct KeadexMinaServer {
  pub tool_router: ToolRouter<KeadexMinaServer>,
}
