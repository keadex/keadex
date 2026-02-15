import { minaMiddleware } from '@keadex/mina-live-npm/nextjs-middleware'
import acceptLanguage from 'accept-language'
import { NextRequest, NextResponse } from 'next/server'

import { cookieName, fallbackLng, languages } from './app/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  matcher: [
    '/((?!api|_pagefind|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
}

export function proxy(req: NextRequest) {
  const minaMiddlewareResponse = minaMiddleware(req)
  if (minaMiddlewareResponse) {
    return minaMiddlewareResponse
  } else {
    let lng
    if (req.cookies.has(cookieName))
      lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
    // if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
    if (!lng) lng = fallbackLng

    // Workaround for Nextra (see apps\keadex-battisti\src\hooks\useNextraSidebarWorkaround\useNextraSidebarWorkaround.tsx)
    // TODO: remove this workaround when the above issues/limitations have been resolved.
    if (req.nextUrl.pathname.includes('/[lang]')) {
      req.nextUrl.pathname = req.nextUrl.pathname.replace('/[lang]', '')
    }

    // Redirect if lng in path is not supported
    if (
      !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
      !req.nextUrl.pathname.startsWith('/_next')
    ) {
      return NextResponse.redirect(
        new URL(`/${lng}${req.nextUrl.pathname}`, req.url),
      )
    }

    if (req.headers.has('referer')) {
      const refererUrl = new URL(req.headers.get('referer')!)
      const lngInReferer = languages.find((l) =>
        refererUrl.pathname.startsWith(`/${l}`),
      )
      const response = NextResponse.next()
      if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
      return response
    }

    return NextResponse.next()
  }
}
