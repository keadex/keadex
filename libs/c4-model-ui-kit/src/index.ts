import './styles/index.css'

// Constants
export {
  DIAGRAM_TYPES,
  DIAGRAM_ELEMENTS_TYPES,
  C4_ELEMENTS_TYPES,
  PERSON_TYPES,
  COMPONENT_TYPES,
  CONTAINER_TYPES,
  SYSTEM_TYPES,
  BOUNDARY_TYPES,
  DEPLOYMENT_NODE_TYPES,
  RELATIONSHIP_TYPES,
  AUTO_LAYOUT_ORIENTATIONS,
} from './constants/diagram'
export {
  CANVAS_EVENTS,
  OBJECT_EVENTS,
  MOUSE_EVENTS,
} from './constants/fabric-events'
export {
  DIAGRAM,
  BOX,
  ELEMENT,
  LEGEND,
  RELATIONSHIP,
} from './styles/style-constants'

// Rendering System
export { renderDiagram } from './rendering-system/diagram-renderer'
export { renderBoundaryDiagramElement } from './rendering-system/boundary-renderer'
export { renderComponentDiagramElement } from './rendering-system/component-renderer'
export { renderContainerDiagramElement } from './rendering-system/container-renderer'
export { renderDeploymentNodeDiagramElement } from './rendering-system/deployment-node-renderer'
export { renderPersonDiagramElement } from './rendering-system/person-renderer'
export { renderRelationshipDiagramElement } from './rendering-system/relationship-renderer'
export { renderSoftwareSystemDiagramElement } from './rendering-system/software-system-renderer'

// Components
export { type DiagramListener } from './components/C4BaseComponent'
export { C4Legend } from './components/C4Legend'
export { C4SoftwareSystem } from './components/c4-software-system/C4SoftwareSystem'
export { C4SoftwareSystemExt } from './components/c4-software-system/C4SoftwareSystemExt'
export { C4Component } from './components/c4-component/C4Component'
export { C4ComponentExt } from './components/c4-component/C4ComponentExt'

// Helpers
export {
  getElementSpecByAlias,
  updateDiagramElementsSpecsFromCanvas,
  boundaryDiagramElement,
  componentDiagramElement,
  containerDiagramElement,
  deploymentNodeDiagramElement,
  personDiagramElement,
  relationshipDiagramElement,
  softwareSystemDiagramElement,
  diagramTypeHumanName,
  diagramDirName,
  c4ElementTypeHumanName,
  c4ElementTypePathName,
  locationEntityHumanName,
  personTypeHumanName,
  parseDiagramTypeHumanName,
  isDefaultDiagramElementSpec,
} from './helper/diagram-helper'
export {
  addObjectsToGroupAndKeepScale,
  getBoundingBox,
  getZIndexOfObject,
  getSavedZIndex,
  getCanvasPan,
  invalidateCanvasCache,
} from './helper/fabric-helper'

// Models
export type { BaseElement } from './models/autogenerated/BaseElement'
export type { Boundary } from './models/autogenerated/Boundary'
export type { BoundaryType } from './models/autogenerated/BoundaryType'
export type { C4ElementType } from './models/autogenerated/C4ElementType'
export type { C4ElementTypeExtended } from './models/autogenerated/C4ElementTypeExtended'
export type { Component } from './models/autogenerated/Component'
export type { ComponentType } from './models/autogenerated/ComponentType'
export type { Container } from './models/autogenerated/Container'
export type { ContainerType } from './models/autogenerated/ContainerType'
export type { DeploymentNode } from './models/autogenerated/DeploymentNode'
export type { DeploymentNodeType } from './models/autogenerated/DeploymentNodeType'
export type { Diagram } from './models/autogenerated/Diagram'
export type { DiagramElementType } from './models/autogenerated/DiagramElementType'
export type { DiagramElementSpec } from './models/autogenerated/DiagramElementSpec'
export type { DiagramOrientation } from './models/autogenerated/DiagramOrientation'
export type { DiagramPlantUML } from './models/autogenerated/DiagramPlantUML'
export type { DiagramSpec } from './models/autogenerated/DiagramSpec'
export type { DiagramsThemeSettings } from './models/autogenerated/DiagramsThemeSettings'
export type { DiagramType } from './models/autogenerated/DiagramType'
export type { ElementType } from './models/autogenerated/ElementType'
export type { Person } from './models/autogenerated/Person'
export type { PersonType } from './models/autogenerated/PersonType'
export type { Position } from './models/autogenerated/Position'
export type { Relationship } from './models/autogenerated/Relationship'
export type { RelationshipType } from './models/autogenerated/RelationshipType'
export type { Shape } from './models/autogenerated/Shape'
export type { ShapeType } from './models/autogenerated/ShapeType'
export type { Size } from './models/autogenerated/Size'
export type { SoftwareSystem } from './models/autogenerated/SoftwareSystem'
export type { SystemType } from './models/autogenerated/SystemType'
