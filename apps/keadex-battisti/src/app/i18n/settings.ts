import { InitOptions } from 'i18next'

export const fallbackLng = 'en'
export const languages = [fallbackLng, 'it']
export const defaultNS = 'translation'
export const cookieName = 'i18next'

export function getOptions(lang = fallbackLng, ns = defaultNS): InitOptions {
  return {
    debug: false, //process.env.NODE_ENV !== 'production',
    supportedLngs: languages,
    fallbackLng,
    lng: lang,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
