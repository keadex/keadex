'use client'

import dynamic from 'next/dynamic'
import { PropsWithChildren } from 'react'
import { useGoogleAnalytics } from '@keadex/keadex-ui-kit/web'
import { TWElementsInit } from '../TWElementsInit/TWElementsInit'

const Header = dynamic(() => import('../Header/Header'))
const Footer = dynamic(() => import('../Footer/Footer'))

export type LayourProps = {
  lang: string
}

//---------- Disable debug and log levels in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.debug = () => {}
}

export default function Layout(props: PropsWithChildren<LayourProps>) {
  const { lang, children } = props

  useGoogleAnalytics()

  return (
    <>
      <TWElementsInit />
      <Header lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  )
}
