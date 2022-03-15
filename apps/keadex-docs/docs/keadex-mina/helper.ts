import { generateTitle as generateGenericTitle } from '../../src/helpers/docs-helper'
import { Modules } from '../../src/constants'

export const generateTitle = (pageTitle?: string) => {
  return generateGenericTitle(Modules.KEADEX_MINA_ID, pageTitle)
}