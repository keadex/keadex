'use client'

import { PropsWithChildren } from 'react'
import { CookiesProvider } from 'react-cookie'

export default function NextraLayout({ children }: PropsWithChildren) {
  return <CookiesProvider>{children}</CookiesProvider>
}
