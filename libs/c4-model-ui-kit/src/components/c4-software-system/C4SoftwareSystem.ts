import C4BaseBox from '../C4BaseBox'
import { BOX } from '../../styles/style-constants'
import { SoftwareSystem } from '../../models/autogenerated/SoftwareSystem'
import { DiagramElementSpec } from '../../models/autogenerated/DiagramElementSpec'
import { C4BaseComponentOptions, C4BaseComponent } from '../C4BaseComponent'
import C4BaseDb from '../C4BaseDb'
import C4BaseQueue from '../C4BaseQueue'

export const C4SoftwareSystem = (
  data: SoftwareSystem,
  elementSpec: DiagramElementSpec,
  options?: Partial<C4BaseComponentOptions>
): C4BaseComponent | undefined => {
  const defaultOptions: C4BaseComponentOptions = {
    bgColor: BOX.COLORS.BG_COLOR_SOFTWARE_SYSTEM_PERSON,
    borderColor: BOX.COLORS.BORDER_COLOR_SOFTWARE_SYSTEM_PERSON,
    textColor: BOX.COLORS.TEXT_COLOR_SOFTWARE_SYSTEM_PERSON,
  }
  const enrichedOptions: C4BaseComponentOptions = {
    ...defaultOptions,
    ...options,
  }
  if (data.system_type) {
    switch (data.system_type) {
      case 'System':
        return C4BaseBox(data, elementSpec, enrichedOptions)
      case 'SystemDb':
        return C4BaseDb(data, elementSpec, enrichedOptions)
      case 'SystemQueue':
        return C4BaseQueue(data, elementSpec, enrichedOptions)
    }
  }
  return
}

export default C4SoftwareSystem