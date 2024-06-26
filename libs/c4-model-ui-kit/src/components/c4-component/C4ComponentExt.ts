import C4BaseBox from '../C4BaseBox'
import { BOX } from '../../styles/style-constants'
import { DiagramElementSpec } from '../../models/autogenerated/DiagramElementSpec'
import { Component } from '../../models/autogenerated/Component'
import { C4BaseComponentOptions, C4BaseComponent } from '../C4BaseComponent'
import C4BaseDb from '../C4BaseDb'
import C4BaseQueue from '../C4BaseQueue'
import { ElementData } from '../../models/autogenerated/ElementData'

export const C4ComponentExt = (
  data: Component,
  elementSpec: DiagramElementSpec,
  autoLayout: Record<string, ElementData>,
  options?: Partial<C4BaseComponentOptions>,
): C4BaseComponent | undefined => {
  const defaultOptions: C4BaseComponentOptions = {
    bgColor: BOX.COLORS.BG_COLOR_COMPONENT_EXT,
    borderColor: BOX.COLORS.BORDER_COLOR_COMPONENT_EXT,
    textColor: BOX.COLORS.TEXT_COLOR_COMPONENT_EXT,
  }
  const enrichedOptions: C4BaseComponentOptions = {
    ...defaultOptions,
    ...options,
  }
  if (data.component_type) {
    switch (data.component_type) {
      case 'Component_Ext':
        return C4BaseBox(data, elementSpec, autoLayout, enrichedOptions)
      case 'ComponentDb_Ext':
        return C4BaseDb(data, elementSpec, autoLayout, enrichedOptions)
      case 'ComponentQueue_Ext':
        return C4BaseQueue(data, elementSpec, autoLayout, enrichedOptions)
    }
  }
  return
}

export default C4ComponentExt
