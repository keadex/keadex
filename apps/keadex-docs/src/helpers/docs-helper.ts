import { Modules } from '../constants'

export const generateTitle = (moduleId: string, pageTitle?: string) => {
  return `Keadex Docs - ${Modules.MODULE_NAMES.get(moduleId)}${
    pageTitle ? ` > ${pageTitle}` : ''
  }`
}
