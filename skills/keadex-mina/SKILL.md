---
name: keadex-mina
description: Create, edit, and manage C4 Model architecture diagrams in Keadex Mina projects using the Mina MCP server tools. Use when working with C4 diagrams, PlantUML-based architecture documentation, or Keadex Mina projects.
---

# Keadex Mina

Keadex Mina is an open-source application for creating, organizing, and managing C4 Model architecture diagrams using a Diagram as Code approach with PlantUML. It is available as a desktop app (Linux, macOS, Windows) and for the web.

Diagrams are written in PlantUML using the C4-PlantUML standard library syntax. All project files are human-readable (.puml and .json), making them ideal for Git version control.

## C4 Model Overview

The C4 model provides four levels of abstraction for software architecture diagrams, like zooming in on a map:

### Core Abstractions

- **Person**: Users (actors, roles, personas) that interact with software systems.
- **Software System**: The highest level of abstraction. Delivers value to its users. Typically corresponds to a single team's responsibility and source code repository.
- **Container**: A running application or data store (server-side web app, SPA, mobile app, database, file system, message queue, etc.). NOT a Docker container. All containers must be running for the system to work.
- **Component**: A grouping of related functionality behind a well-defined interface within a container. Not separately deployable.
- **Relationship**: A unidirectional, labeled connection between elements. Must describe the intent (e.g., "sends customer update events to", not just "uses"). Inter-container relationships must include the technology/protocol.

### Diagram Types

1. **System Landscape** — Shows all systems and people across an enterprise. No specific system focus.
2. **System Context** — A single system as a box in the center, surrounded by its users and other systems it interacts with. Start here.
3. **Container** — Zooms into a system to show containers (apps, data stores), their responsibilities, technology choices, and communication.
4. **Component** — Zooms into a container to show its internal components.
5. **Dynamic** — Shows runtime behavior: how elements collaborate to implement a feature. Uses numbered interactions.
6. **Deployment** — Maps containers to infrastructure (physical, virtual, containerized, cloud).

### Diagram Best Practices

- Every diagram must have a title describing its type and scope.
- Every diagram should have a key/legend explaining notation.
- Every element must have a name and should have a short description.
- Every container and component should specify its technology.
- Every relationship line must be labeled with intent matching its direction.
- Do not mix abstraction levels in a single diagram.
- You don't need all 4 levels — System Context and Container diagrams suffice for most teams.

## Mina Project Structure

```
diagrams/
 system-landscape/       # System Landscape diagrams
 system-context/         # System Context diagrams
 container/              # Container diagrams
 component/              # Component diagrams
 dynamic/                # Dynamic diagrams
 deployment/             # Deployment diagrams
library/
 persons.json            # Reusable Person elements
 software-systems.json   # Reusable Software System elements
 containers.json         # Reusable Container elements
 components.json         # Reusable Component elements
hooks.js                  # Custom JavaScript hooks (onDiagramCreated, onDiagramDeleted, onDiagramSaved)
mina.json                 # Project config (name, version, description, settings)
```

Each diagram lives in its own subfolder containing:

- `diagram.puml` — PlantUML source code
- `diagram.spec.json` — Mina-generated specs (element positions, sizes for rendering)

### Library

The library stores reusable C4 elements. When you modify a library element, the change propagates to all diagrams that import it.

**Library-first principle**: Always check the library before adding elements to a diagram. If a matching element already exists, reuse it instead of creating a duplicate. If an element appears (or will appear) in multiple diagrams, add it to the library and reference it from each diagram. To modify an element that exists in the library, update the library entry — never edit the element inline in a diagram, as the library version is the source of truth and changes propagate automatically.

### Links in Diagrams

- **Internal links**: Use format `DIAGRAM_TYPE/DIAGRAM_NAME` (lowercase, dashes). Example: `container/my-api`.
- **External links**: Use `http`/`https` URLs. Support dynamic variables like `<ALIAS>`.
- Links are set via the `$link` property in PlantUML code.

## MCP Server Tools

The Keadex Mina MCP server (`@keadex/mina-mcp-server`) exposes 27 tools for AI assistants to interact with Mina projects. Configure it as:

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

### Workflow

**Always start by opening the project** with `open_local_project` before using any other local tool. Close with `close_local_project` when done.

### Project Tools

| Tool                                  | Description                                                                                                                       | Read-only |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `open_local_project`                  | Opens an existing Mina project. Required before any other local operation. Params: `{ projectPath }`                              | Yes       |
| `close_local_project`                 | Closes an open project. Params: `{ projectPath }`                                                                                 | Yes       |
| `create_local_project`                | Creates a new Mina project. Params: `{ root, name, description, version }`                                                        | No        |
| `validate_local_project`              | Validates structural integrity of a project. Params: `{ projectPath }`                                                            | No        |
| `search_and_replace_in_local_project` | Search and replace text across diagrams and library. Params: `{ text_to_search, replacement, include_diagrams, include_library }` | No        |

### Diagram Tools

| Tool                                       | Description                                                                                                           | Read-only |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | --------- |
| `list_local_diagrams`                      | Lists all diagrams as a map of diagram types to names. No params.                                                     | Yes       |
| `read_local_diagram`                       | Retrieves full diagram data (PlantUML code, JSON, metadata). Params: `{ diagramName, diagramType }`                   | Yes       |
| `read_all_local_diagrams`                  | Returns all diagrams with full detail. No params.                                                                     | Yes       |
| `render_local_diagram`                     | Renders a diagram as PNG image. Params: `{ diagramName, diagramType }`                                                | Yes       |
| `create_local_diagram`                     | Creates a new empty diagram (no PlantUML code). Params: `{ diagramName, diagramType, description?, tags? }`           | No        |
| `delete_local_diagram`                     | Deletes a diagram. Params: `{ diagramName, diagramType }`                                                             | No        |
| `edit_local_diagram_plantuml_code`         | Replaces the PlantUML code of a diagram. Params: `{ rawPlantUml, diagramName, diagramType }`                          | No        |
| `validate_local_diagram`                   | Validates syntax and integrity. Params: `{ diagramName, diagramType }`                                                | Yes       |
| `search_diagram_element_in_local_project`  | Searches for an element across all diagrams by alias. Params: `{ diagramElementAlias }`                               | Yes       |
| `find_dependent_elements_in_local_diagram` | Finds elements that depend on a given alias in a diagram. Params: `{ diagramElementAlias, diagramName, diagramType }` | Yes       |

### Library Tools

| Tool                                      | Description                                                                        | Read-only |
| ----------------------------------------- | ---------------------------------------------------------------------------------- | --------- |
| `list_local_library_elements`             | Lists all library elements (persons, systems, containers, components). No params.  | Yes       |
| `search_diagram_element_in_local_library` | Searches for an element in the library by alias. Params: `{ diagramElementAlias }` | Yes       |
| `upsert_person_in_local_library`          | Creates or updates a Person in the library.                                        | No        |
| `upsert_system_in_local_library`          | Creates or updates a Software System in the library.                               | No        |
| `upsert_container_in_local_library`       | Creates or updates a Container in the library.                                     | No        |
| `upsert_component_in_local_library`       | Creates or updates a Component in the library.                                     | No        |

Upsert operations create the element if it doesn't exist, or update it if it does. Updates automatically propagate to all diagrams referencing the element.

### PlantUML Code Tools

| Tool                                         | Description                                                                                                                         | Read-only |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `generate_plantuml_code_of_diagram`          | Generates PlantUML code from a diagram ID and elements. Params: `{ diagramId?, diagramElements }`                                   | Yes       |
| `generate_plantuml_code_of_diagram_elements` | Generates PlantUML code for specific elements (for insertion into an existing diagram). Params: `{ diagramElements, indentation? }` | Yes       |
| `validate_diagram_plantuml_code`             | Validates PlantUML syntax. Params: `{ plantumlCode }`                                                                               | Yes       |

### Remote Diagram Tools

| Tool                    | Description                                                                                           | Read-only |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | --------- |
| `read_remote_diagram`   | Reads a diagram from a GitHub-hosted Mina project. Params: `{ projectRootUrl, diagramUrl, ghToken? }` | Yes       |
| `render_remote_diagram` | Renders a remote diagram as PNG. Params: `{ projectRootUrl, diagramUrl, ghToken? }`                   | Yes       |

For private repos, provide a GitHub token via `ghToken`.

### DiagramType Values

Use one of these values for the `diagramType` parameter:

- `SystemLandscape`
- `SystemContext`
- `Container`
- `Component`
- `Dynamic`
- `Deployment`

## Common Workflows

### Creating a New Diagram

1. Open the project with `open_local_project`.
2. **Check the library first** with `list_local_library_elements`. Reuse existing library elements instead of defining duplicates. If a new element will appear in multiple diagrams, add it to the library with the appropriate upsert tool before referencing it in the diagram.
3. Create the empty diagram with `create_local_diagram`, providing the type, name, and optional description/tags. This tool does not accept PlantUML code.
4. **Generate the PlantUML code** by defining the diagram elements as JSON and passing them to `generate_plantuml_code_of_diagram` (for a full diagram) or `generate_plantuml_code_of_diagram_elements` (for individual elements). Never write PlantUML code by hand — always use these generation tools.
5. **Add the PlantUML code** to the diagram with `edit_local_diagram_plantuml_code`.
6. **Validate** the diagram with `validate_local_diagram` or the PlantUML code with `validate_diagram_plantuml_code`. Validation is mandatory after every creation.
7. Render with `render_local_diagram` to verify the visual output.

### Editing an Existing Diagram

1. Open the project with `open_local_project`.
2. Read the current diagram with `read_local_diagram` to get its PlantUML code and elements.
3. **Check the library** with `list_local_library_elements` or `search_diagram_element_in_local_library`. If the element you need to modify exists in the library, update it there using the appropriate upsert tool — the change will propagate to all diagrams automatically. Only edit the diagram's PlantUML directly for diagram-local changes (e.g., relationships, layout).
4. **Generate the updated PlantUML code** using `generate_plantuml_code_of_diagram` (to regenerate the full diagram from its elements) or `generate_plantuml_code_of_diagram_elements` (to generate code for new/modified elements to insert). Never write PlantUML code by hand — always use these generation tools.
5. Apply the generated code with `edit_local_diagram_plantuml_code`.
6. **Validate** the diagram with `validate_local_diagram` or the PlantUML code with `validate_diagram_plantuml_code`. Validation is mandatory after every edit.
7. Render with `render_local_diagram` to verify.

### Managing the Library

1. Open the project with `open_local_project`.
2. List existing elements with `list_local_library_elements`.
3. Use `upsert_person_in_local_library`, `upsert_system_in_local_library`, `upsert_container_in_local_library`, or `upsert_component_in_local_library` to create or update elements.
4. Changes propagate automatically to all diagrams using the element.

### Exploring Architecture

1. Open the project with `open_local_project`.
2. List all diagrams with `list_local_diagrams`.
3. Read specific diagrams with `read_local_diagram` or all with `read_all_local_diagrams`.
4. Search for specific elements with `search_diagram_element_in_local_project`.
5. Analyze dependencies with `find_dependent_elements_in_local_diagram`.

## Supported PlantUML C4 Syntax

Mina uses a custom Pest parser that supports only C4 Model elements from the [C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML) library (v2.4.0). It does NOT support the full PlantUML syntax — only what's needed for C4 diagrams. This ensures portability: code written in other C4-PlantUML tools can be imported, and Mina diagrams work in other PlantUML-supporting tools.

### Diagram Structure

```
@startuml(id=optionalDiagramId)
 !include <...>
 ' comments
 ...elements, boundaries, relationships...
@enduml
```

### Context Elements (Person & System)

Supported types: `Person`, `Person_Ext`, `System`, `System_Ext`, `SystemDb`, `SystemDb_Ext`, `SystemQueue`, `SystemQueue_Ext`

```
Type(alias, "Label", "Description", $sprite="...", $tags="...", $link="...")
```

- `alias` (required): Identifier (alphanumeric, `.`, `_`). Can be quoted.
- `"Label"` (required): Display name. Can be empty (`""`).
- `"Description"` (optional): Quoted string.
- `$sprite`, `$tags`, `$link` (optional): Named parameters.

### Container & Component Elements

Supported types: `Container`, `Container_Ext`, `ContainerDb`, `ContainerDb_Ext`, `ContainerQueue`, `ContainerQueue_Ext`, `Component`, `Component_Ext`, `ComponentDb`, `ComponentDb_Ext`, `ComponentQueue`, `ComponentQueue_Ext`

```
Type(alias, "Label", "Technology", "Description", $sprite="...", $tags="...", $link="...")
```

- `alias` (required), `"Label"` (required): Same as context elements.
- `"Technology"` (optional): Quoted string.
- `"Description"` (optional): Quoted string.
- `$sprite`, `$tags`, `$link` (optional): Named parameters.

### Boundaries

Supported types: `Enterprise_Boundary`, `System_Boundary`, `Container_Boundary`

```
Type(alias, "Label", $tags="...", $link="...") {
 ...nested elements...
}
```

Generic boundary with explicit type:

```
Boundary(alias, "Label", "$type=TypeName" or "TypeName", $tags="...", $link="...") {
 ...nested elements...
}
```

Boundaries can nest any `uml_element` (other elements, boundaries, relationships, etc.).

### Deployment Nodes

Supported types: `Deployment_Node`, `Deployment_Node_L`, `Deployment_Node_R`, `Node`, `Node_L`, `Node_R`

```
Type(alias, "Label", "$type=..." or "Type", "Description", $sprite="...", $tags="...", $link="...") {
 ...nested elements...
}
```

Deployment nodes are boundaries that can nest other elements.

### Relationships

Supported types: `Rel`, `Rel_Back`, `Rel_Neighbor`, `Rel_Back_Neighbor`, `Rel_Down`/`Rel_D`, `Rel_Up`/`Rel_U`, `Rel_Left`/`Rel_L`, `Rel_Right`/`Rel_R`, `BiRel`, `BiRel_Neighbor`, `BiRel_Down`/`BiRel_D`, `BiRel_Up`/`BiRel_U`, `BiRel_Left`/`BiRel_L`, `BiRel_Right`/`BiRel_R`

```
Type(fromAlias, toAlias, "Label", "Technology", "Description", $sprite="...", $tags="...", $link="...")
```

- `fromAlias`, `toAlias` (required): Element aliases.
- `"Label"` (required): Relationship description.
- `"Technology"`, `"Description"` (optional): Quoted strings.

### Element Tag Styling

```
AddElementTag("tagName", $bgColor="...", $fontColor="...", $borderColor="...", $shadowing="...", $shape="...", $sprite="...", $techn="...", $legendText="...", $legendSprite="...", $borderStyle="...", $borderThickness="...")
```

All parameters after `tagName` are optional. Apply tags to elements via `$tags="tagName"`.

### Includes and Comments

```
!include <C4/C4_Context>
' single line comment
/' multi-line comment '/
```

### Parameter Reference

| Parameter | Syntax                     | Notes                                  |
| --------- | -------------------------- | -------------------------------------- |
| `$sprite` | `$sprite="spriteName"`     | Icon/sprite reference                  |
| `$tags`   | `$tags="tag1+tag2"`        | Element tags for styling               |
| `$link`   | `$link="container/my-api"` | Internal or external link              |
| `$type`   | `$type="TypeName"`         | Boundary/node type                     |
| `$techn`  | `$techn="Technology"`      | Explicit technology (in AddElementTag) |

### Alias Rules

Aliases must consist of: ASCII alphanumeric characters, `.`, or `_`. They can optionally be quoted with double quotes. Examples: `mySystem`, `my_api.v2`, `"my.alias"`.
