import { Component } from '../../models/autogenerated/Component'
import { DiagramElementSpec } from '../../models/autogenerated/DiagramElementSpec'
import { ElementData } from '../../models/autogenerated/ElementData'
import { RenderElementsOptions } from '../../rendering-system/diagram-renderer'
import { BOX } from '../../styles/style-constants'
import C4BaseBox from '../C4BaseBox'
import { C4BaseComponent, C4BaseComponentOptions } from '../C4BaseComponent'
import C4BaseDb from '../C4BaseDb'
import C4BaseQueue from '../C4BaseQueue'

export const C4ComponentExt = (
  data: Component,
  elementSpec: DiagramElementSpec,
  autoLayout: Record<string, ElementData>,
  options: Partial<C4BaseComponentOptions> | undefined,
  renderElementsOptions: RenderElementsOptions | undefined,
): C4BaseComponent | undefined => {
  const defaultOptions: C4BaseComponentOptions = {
    bgColor:
      renderElementsOptions?.diagramsThemeSettings?.bg_color_component_ext ??
      BOX.COLORS.BG_COLOR_COMPONENT_EXT,
    borderColor:
      renderElementsOptions?.diagramsThemeSettings
        ?.border_color_component_ext ?? BOX.COLORS.BORDER_COLOR_COMPONENT_EXT,
    textColor:
      renderElementsOptions?.diagramsThemeSettings?.text_color_component_ext ??
      BOX.COLORS.TEXT_COLOR_COMPONENT_EXT,
  }
  const enrichedOptions: C4BaseComponentOptions = {
    ...defaultOptions,
    ...options,
  }
  if (data.component_type) {
    switch (data.component_type) {
      case 'Component_Ext':
        return C4BaseBox(
          data,
          elementSpec,
          autoLayout,
          enrichedOptions,
          renderElementsOptions,
        )
      case 'ComponentDb_Ext':
        return C4BaseDb(
          data,
          elementSpec,
          autoLayout,
          enrichedOptions,
          renderElementsOptions,
        )
      case 'ComponentQueue_Ext':
        return C4BaseQueue(
          data,
          elementSpec,
          autoLayout,
          enrichedOptions,
          renderElementsOptions,
        )
    }
  }
  return
}

export default C4ComponentExt
