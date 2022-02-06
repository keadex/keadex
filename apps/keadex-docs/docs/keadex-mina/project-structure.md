---
id: project-structure
title: Project Structure
sidebar_label: Project Structure
slug: /keadex-mina/project-structure
displayed_sidebar: keadexMinaSidebar
---

## Project Specifications

```bash
|_ diagrams
  |_ system-context
    |_ diagram-name1
      |_ diagram.puml
      |_ diagram.spec.json
    |_ ...
  |_ container
  |_ component
  |_ system-landscape
  |_ dynamic
  |_ deployment
|_ library
  |_ persons.json
  |_ software-systems.json
  |_ containers.json
  |_ components.json
|_ mina.json
```

- ``` diagrams ```: contains all the diagrams.
  - ``` system-context ```: contains *System Context* diagrams. Each subfolder represents a diagram.
    - ``` diagram-name1 ```: example of a diagram's folder. The folder's name follows the lower-kebab-case naming convention. Each diagram's folder contains **2 files**:
      - ``` diagram.puml ```: PlantUML code of the diagram.
      - ``` diagram.spec.json ```: settings (e.g. name, description, etc.) and rendering data (e.g. positions, sizes, etc.) of the diagram.
  - ``` container ```: contains *Container* diagrams.
  - ``` component ```: contains *Component* diagrams.
  - ``` system-landscape ```: contains *System Context* diagrams.
  - ``` dynamic ```: contains *Dynamic* diagrams.
  - ``` deployment ```: contains *Deployment* diagrams.
- ``` library ```: contains the C4 Model **entities** shared across the diagrams. The entities stored in this folder can be *searched* and *imported* in the diagrams, without the need to create them from scratch.<br/>
Reusing stored entities will help you also to **retrieve** the diagrams which use them; in this way you will be able to easily answer to questions like:
  - Where are used the "Web Client" and "Backend" *containers*?
  - What uses the "Order Microservice" *components*?
  - How does it work the "eCommerce" *software system*?
The ``` library ``` folder contains the following files:
  - ``` persons.json ```: stored *person* entities.
  - ``` software-systems.json ```: stored *software system* entities.
  - ``` containers.json ```: stored *container* entities.
  - ``` components.json ```: stored *component* entities.
- ```mina.json ```: settings of the project (e.g. name, description, version, etc.).



## Files Specifications

### diagram.puml

```scheme title="/diagrams/*/*/diagram.puml"
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "Customer", "People that need products", $sprite="users")
Container(spa, "SPA", "angular", "The main interface that the customer interacts with", $sprite="angular")
Container(api, "API", "java", "Handles all business logic", $sprite="java")
ContainerDb(db, "Database", "Microsoft SQL", "Holds product, order and invoice information", $sprite="msql_server")

Rel(user, spa, "Uses")
Rel(spa, api, "Uses")
Rel_R(api, db, "Reads/Writes")

@enduml
```

Mina supports the **PlantUML** syntax to code the diagrams. In addition, the [Mina Rendering System](./architecture/rendering-system.md) uses the [C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML) definitions to render the diagrams.<br/>

:::caution

Even if you don't need to include the C4-PlantUML definitions (since Mina has its rendering system), **it's strongly suggested to do so** to guarantee the compatibility with also other PlantUML tools.

:::


### diagram.spec.json

Mina stores in this file the diagram's settings and the rendering data used by the [rendering system](./architecture/rendering-system.md).<br/>
The diagram's spec file can be considered the extension of the PlantUML definitions. Thanks to this Mina is able to provide capabilities like: navigations between diagrams, interactive diagrams, custom rendering result.

```json title="/diagrams/*/*/diagram.spec.json"
{
  "name": "My first System Context diagram",
  "description": "This is an example of my first System Context diagram",
  "entities": [
    {
      "id": "softwareSystem1",
      "type": "SOFTWARE_SYSTEM",
      "position": {
        "x": 0,
        "y": 1
      },
      "size": {
        "width": 180,
        "height": 120
      },
      "externalDiagramId": "diagramId1"
    },
    {
      "id": "relationship1",
      "type": "RELATIONSHIP",
      "position": {
        "x": 0,
        "y": 1
      },
      "size": 120
    }
  ]
}
```

#### JSON Specification

| Attribute | Type | Optional | Description |
| --- | :---: | :---: | ----------- |
| ``` name ``` | string | No | Name of the diagram. |
| ``` description ``` | string | Yes | Description of the diagram. |
| ``` entities ``` | Entity[] | Yes | Entities included in the diagram. |


### persons.json

Stored *person* entities used by Mina to provide capabilities like: search & import of a *person*, list of the diagrams referencing a *person*. 

```json title="/library/persons.json"
[
  {
    "id": "developer",
    "name": "Developer",
    "description": "This is an example of a person entity.",
    "location": "INTERNAL",
    "notes": "Other notes not visible in the diagram."
  }
]
```

#### JSON Specification

| Attribute | Type | Optional | Description |
| --- | :---: | :---: | ----------- |
| *root* | Person[] | Yes | Stored persons. |


### Object Types

| Name | Attribute(s) | Type | Optional | Description |
| --- | --- | :---: | :---: | ----------- |
| Entity | ``` id ``` | string | No | Unique identifier of the entity. |
| | ``` type ``` | string | No | Type of entity. Options: ``` PERSON ```, ``` SOFTWARE_SYSTEM ```, ``` CONTAINER ```, ``` COMPONENT ```, ``` RELATIONSHIP ``` |
| | ``` position ``` | Position | No | Canvas-relative position of the entity.  |
| | ``` size ``` | Size \| float | No | Size of the entity. In case of ```"type": "RELATIONSHIP"```, it is a number representing the length of the arrow. |
| | ``` externalDiagramId ``` | string | Yes | Id of the diagram linked to the entity. It is used, for example, to allow navigations between diagrams. |
| Position | ``` x ``` | float | No | Location on the y (vertical) axis of the canvas. |
| | ``` y ``` | float | No | Location on the x (horizontal) axis of the canvas. |
| Size | ``` width ``` | float | No | Width of the entity. |
| | ``` height ``` | float | No | Height of the entity. |
| Person | ``` id ``` | string | No | Unique identifier of the person. It corresponds to the ``` id ``` defined in the ``` .puml ``` file. |
| | ``` name ``` | string | No | Name of the person. It corresponds to the ``` name ``` defined in the ``` .puml ``` file. |
| | ``` description ``` | string | Yes | Description of the person. It corresponds to the ``` description ``` defined in the ``` .puml ``` file. |
| | ``` location ``` | string | Yes | Location of the person: internal or external to the organization. Options: ``` INTERNAL ```, ``` EXTERNAL ```. Default: ``` INTERNAL ```. |
| | ``` notes ``` | string | Yes | Additional notes not included in the diagram but used for searching purposes or included in the exported documentation. Notes typically contain a more detailed description of the person. |
