import C4SoftwareSystem from '../components/c4-software-system/C4SoftwareSystem'
import { DiagramSpec } from '../models/autogenerated/DiagramSpec'
import { SoftwareSystem } from '../models/autogenerated/SoftwareSystem'
import { getElementSpecByAlias } from '../helper/diagram-helper'
import C4SoftwareSystemExt from '../components/c4-software-system/C4SoftwareSystemExt'
import { RenderElementsOptions } from './diagram-renderer'
import { C4BaseComponent } from '../components/C4BaseComponent'
import { ElementData } from '../models/autogenerated/ElementData'

export const renderSoftwareSystemDiagramElement = (
  canvas: fabric.Canvas | undefined,
  softwareSystem: SoftwareSystem,
  diagramSpec: DiagramSpec,
  autoLayout: Record<string, ElementData>,
  options?: RenderElementsOptions,
): C4BaseComponent | undefined => {
  if (
    softwareSystem.base_data &&
    softwareSystem.base_data.alias &&
    softwareSystem.system_type &&
    ((diagramSpec.auto_layout_enabled &&
      autoLayout[softwareSystem.base_data.alias]) ||
      !diagramSpec.auto_layout_enabled)
  ) {
    let c4SoftwareSystem: C4BaseComponent | undefined
    switch (softwareSystem.system_type) {
      case 'System':
      case 'SystemDb':
      case 'SystemQueue':
        c4SoftwareSystem = C4SoftwareSystem(
          softwareSystem,
          getElementSpecByAlias(
            softwareSystem.base_data.alias,
            undefined,
            undefined,
            { SoftwareSystem: softwareSystem.system_type },
            diagramSpec,
          ),
          autoLayout,
          undefined,
          options,
        )
        break
      case 'System_Ext':
      case 'SystemDb_Ext':
      case 'SystemQueue_Ext':
        c4SoftwareSystem = C4SoftwareSystemExt(
          softwareSystem,
          getElementSpecByAlias(
            softwareSystem.base_data.alias,
            undefined,
            undefined,
            { SoftwareSystem: softwareSystem.system_type },
            diagramSpec,
          ),
          autoLayout,
          undefined,
          options,
        )
        break
    }
    if ((!options || !options.skipAddToCanvas) && c4SoftwareSystem)
      canvas?.add(c4SoftwareSystem)
    return c4SoftwareSystem
  }
  return
}

export default renderSoftwareSystemDiagramElement
