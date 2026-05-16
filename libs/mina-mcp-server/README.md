<p align="center">
  <img src="https://raw.githubusercontent.com/keadex/keadex/main/libs/mina-mcp-server/static/mina-mcp-server-logo.svg" width="400" alt="Keadex Mina MCP Server Logo" />
</p>

<div align="center">

![GitHub](https://img.shields.io/github/license/keadex/keadex)
![Dynamic TOML Badge](https://img.shields.io/badge/dynamic/toml?url=https%3A%2F%2Fraw.githubusercontent.com%2Fkeadex%2Fkeadex%2Frefs%2Fheads%2Fmain%2Flibs%2Fmina-mcp-server%2FCargo.toml&query=package.version&label=version)

</div>

## Quick Overview

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server for [Keadex Mina](https://keadex.dev/mina) — the Diagram as Code tool for C4 Model architectural diagrams.

This server allows AI assistants like Claude to interact with your Mina project: reading, rendering, and reasoning about your architectural diagrams directly from your local machine.

For more details, please refer to the [Mina MCP Server documentation](http://keadex.dev/en/docs/mina/features/mcp-server).

## Requirements

- [Node.js](https://nodejs.org) >= 18

## Supported Platforms

| Platform | Architecture |
| -------- | ------------ |
| Linux    | x64          |
| macOS    | x64, arm64   |
| Windows  | x64          |

## Usage

### Installation

#### Keadex Mina Skill

Add the Keadex Mina skill to your AI assistant (e.g. Claude, Cursor). The skill provides the necessary prompts and logic to work with Mina projects, and it will automatically use the MCP server to execute commands.

```bash
npx skills add keadex/keadex -s keadex-mina
```

#### MCP Server

No manual installation is required. Run the MCP server directly with `npx`:

```bash
npx @keadex/mina-mcp-server
```

### MCP Client Configuration

#### Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mina": {
      "command": "npx",
      "args": ["-y", "@keadex/mina-mcp-server"]
    }
  }
}
```

#### Cursor

Add the following to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "mina": {
      "command": "npx",
      "args": ["-y", "@keadex/mina-mcp-server"]
    }
  }
}
```

## How It Works

```
AI Assistant (Claude, Cursor, etc.)
        │  MCP protocol (stdio)
        ▼
@keadex/mina-mcp-server
  ├── Rust binary  ←  handles MCP protocol
  └── JS bridge    ←  runs Mina rendering logic
```

The package ships a precompiled Rust binary for your platform (installed automatically as an optional dependency) alongside a JavaScript bridge that executes Mina's rendering and parsing logic. The correct binary for your OS and architecture is resolved automatically at runtime.

## Example Prompts

Once the MCP server is connected to your AI assistant, you can ask things like:

- _"List all the diagrams in my Mina project"_
- _"Show me the system context diagram for the payment service"_
- _"Render the container diagram for the frontend application"_
- _"What are the relationships between the components in the auth service diagram?"_
- _"Summarize the architecture described in my Mina project"_
