import { Boundary } from '../models/autogenerated/Boundary'
import { DiagramSpec } from '../models/autogenerated/DiagramSpec'
import C4Boundary from '../components/C4Boundary'
import { getElementSpecByAlias } from '../helper/diagram-helper'
import { C4BaseElastiContainerComponent } from '../components/C4BaseElasticContainer'
import { RenderElementsOptions } from './diagram-renderer'
import { flatVirtualGroupChildren } from '../helper/fabric-helper'
import { ElementData } from '../models/autogenerated/ElementData'

export const renderBoundaryDiagramElement = (
  canvas: fabric.Canvas | undefined,
  boundary: Boundary,
  diagramSpec: DiagramSpec,
  autoLayout: Record<string, ElementData>,
  options?: RenderElementsOptions,
): C4BaseElastiContainerComponent | undefined => {
  if (
    boundary.base_data &&
    boundary.base_data.alias &&
    boundary.base_data.label &&
    boundary.boundary_type &&
    ((diagramSpec.auto_layout_enabled &&
      autoLayout[boundary.base_data.alias]) ||
      !diagramSpec.auto_layout_enabled)
  ) {
    const c4Boundary = C4Boundary(
      boundary,
      getElementSpecByAlias(
        boundary.base_data.alias,
        undefined,
        undefined,
        { Boundary: boundary.boundary_type },
        diagramSpec,
      ),
      diagramSpec,
      autoLayout,
    )
    if ((!options || !options.skipAddToCanvas) && c4Boundary)
      canvas?.add(
        c4Boundary,
        ...flatVirtualGroupChildren(c4Boundary.children ?? []),
      )
    return c4Boundary
  }
  return
}

export default renderBoundaryDiagramElement