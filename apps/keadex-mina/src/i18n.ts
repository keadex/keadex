import i18n, { InitOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend, { HttpBackendOptions } from 'i18next-http-backend'

function initi18n(options?: InitOptions<HttpBackendOptions>) {
  return (
    i18n
      // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
      // learn more: https://github.com/i18next/i18next-http-backend
      // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
      .use(Backend)
      // pass the i18n instance to react-i18next.
      .use(initReactI18next)
      // init i18next
      // for all options read: https://www.i18next.com/overview/configuration-options
      .init({
        lng: 'en',
        fallbackLng: 'en',
        debug: process.env.NODE_ENV !== 'production',

        interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        },

        ...(options ? options : {}),
      })
  )
}

export default initi18n
