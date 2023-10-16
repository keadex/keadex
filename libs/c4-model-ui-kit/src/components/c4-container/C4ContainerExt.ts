import C4BaseBox from '../C4BaseBox'
import { BOX } from '../../styles/style-constants'
import { DiagramElementSpec } from '../../models/autogenerated/DiagramElementSpec'
import { Container } from '../../models/autogenerated/Container'
import { C4BaseComponentOptions, C4BaseComponent } from '../C4BaseComponent'
import C4BaseDb from '../C4BaseDb'
import C4BaseQueue from '../C4BaseQueue'

export const C4ContainerExt = (
  data: Container,
  elementSpec: DiagramElementSpec,
  options?: Partial<C4BaseComponentOptions>
): C4BaseComponent | undefined => {
  const defaultOptions: C4BaseComponentOptions = {
    bgColor: BOX.COLORS.BG_COLOR_CONTAINER_EXT,
    borderColor: BOX.COLORS.BORDER_COLOR_CONTAINER_EXT,
    textColor: BOX.COLORS.TEXT_COLOR_CONTAINER_EXT,
  }
  const enrichedOptions: C4BaseComponentOptions = {
    ...defaultOptions,
    ...options,
  }
  if (data.container_type) {
    switch (data.container_type) {
      case 'Container_Ext':
        return C4BaseBox(data, elementSpec, enrichedOptions)
      case 'ContainerDb_Ext':
        return C4BaseDb(data, elementSpec, enrichedOptions)
      case 'ContainerQueue_Ext':
        return C4BaseQueue(data, elementSpec, enrichedOptions)
    }
  }
  return
}

export default C4ContainerExt
