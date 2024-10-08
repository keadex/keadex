import { DiagramSpec } from '../models/autogenerated/DiagramSpec'
import { Relationship } from '../models/autogenerated/Relationship'
import {
  C4Relationship,
  C4RelationshipComponent,
} from '../components/C4Relationship'
import { getElementSpecByAlias } from '../helper/diagram-helper'
import { RenderElementsOptions } from './diagram-renderer'
import { ElementData } from '../models/autogenerated/ElementData'

export const renderRelationshipDiagramElement = (
  canvas: fabric.Canvas | undefined,
  relationship: Relationship,
  diagramSpec: DiagramSpec,
  autoLayout: Record<string, ElementData>,
  options?: RenderElementsOptions,
): C4RelationshipComponent | undefined => {
  if (
    relationship.base_data &&
    relationship.base_data.alias &&
    relationship.relationship_type &&
    ((diagramSpec.auto_layout_enabled &&
      autoLayout[relationship.base_data.alias]) ||
      !diagramSpec.auto_layout_enabled)
  ) {
    const component = C4Relationship(
      relationship,
      getElementSpecByAlias(
        relationship.base_data.alias,
        relationship.from,
        relationship.to,
        { Relationship: relationship.relationship_type },
        diagramSpec,
      ),
      autoLayout,
      options,
    )
    if ((!options || !options.skipAddToCanvas) && component)
      canvas?.add(component, ...(component.children ?? []))
    return component
  }
  return
}

export default renderRelationshipDiagramElement
