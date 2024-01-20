import Cookies from 'js-cookie'
import { Dispatch, SetStateAction } from 'react'
import ReactGA from 'react-ga4'

export type CookieConsent = {
  stamp: string
  necessary: boolean
  preferences: boolean
  statistics: boolean
  marketing: boolean
  ver: number
  utc: number
  region: string
}

export function initGA() {
  console.debug(`GA init ${process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID']!}`)
  ReactGA.initialize([
    {
      trackingId: process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID']!,
      gtagOptions: { anonymize_ip: true, send_page_view: false },
    },
  ])
}

export function logPageView() {
  console.debug(`Logging pageview for ${window.location.pathname}`)
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
}

export function logEvent(category = '', action = '') {
  if (category && action) {
    ReactGA.event({
      category: category,
      action: action,
    })
  }
}

export function logException(description = '', fatal = false) {
  if (description) {
    ReactGA.event(
      {
        action: 'exception',
        category: '',
      },
      {
        description: description,
        fatal: fatal,
      },
    )
  }
}

export function addGoogleAnalytics(
  isGAInitialized: boolean,
  setIsGAInitialized: Dispatch<SetStateAction<boolean>>,
) {
  //---- start to use Google Analytics only if the user has given the consensus
  let cookieConsentValue = Cookies.get('CookieConsent')

  //fix Cookiebot "CookieConsent" cookie json string (missing quotes)
  cookieConsentValue = cookieConsentValue
    ?.replace(/{/gi, '{"')
    .replace(/:/gi, '":')
    .replace(/,/gi, ',"')
    .replace(/'/gi, '"')

  if (
    !isGAInitialized &&
    cookieConsentValue &&
    (JSON.parse(cookieConsentValue) as CookieConsent).statistics
  ) {
    initGA()
    setIsGAInitialized(true)
  }
  if (isGAInitialized) {
    logPageView()
  }
}
