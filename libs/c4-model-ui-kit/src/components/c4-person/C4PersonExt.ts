import { BOX } from '../../styles/style-constants'
import { DiagramElementSpec } from '../../models/autogenerated/DiagramElementSpec'
import { Container } from '../../models/autogenerated/Container'
import { C4BaseComponentOptions, C4BaseComponent } from '../C4BaseComponent'
import C4BasePerson from './C4BasePerson'

export const C4PersonExt = (
  data: Container,
  elementSpec: DiagramElementSpec,
  options?: Partial<C4BaseComponentOptions>
): C4BaseComponent | undefined => {
  const defaultOptions: C4BaseComponentOptions = {
    bgColor: BOX.COLORS.BG_COLOR_SOFTWARE_SYSTEM_PERSON_EXT,
    borderColor: BOX.COLORS.BORDER_COLOR_SOFTWARE_SYSTEM_PERSON_EXT,
    textColor: BOX.COLORS.TEXT_COLOR_SOFTWARE_SYSTEM_PERSON_EXT,
  }
  const enrichedOptions: C4BaseComponentOptions = {
    ...defaultOptions,
    ...options,
  }
  return C4BasePerson(data, elementSpec, enrichedOptions)
}

export default C4PersonExt
