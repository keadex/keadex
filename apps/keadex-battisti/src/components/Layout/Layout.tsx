'use client'

import { NewsBanner, useAppBootstrap } from '@keadex/keadex-ui-kit/cross'
import dynamic from 'next/dynamic'
import { PropsWithChildren } from 'react'
import { NEWS } from '../../core/news'
import { usePathname } from 'next/navigation'
import ROUTES from '../../core/routes'

const Header = dynamic(() => import('../Header/Header'))
const Footer = dynamic(() => import('../Footer/Footer'))

export type LayourProps = {
  lang: string
}

//---------- Disable debug and log levels in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {
    // do nothing
  }
  console.debug = () => {
    // do nothing
  }
}

export default function Layout(props: PropsWithChildren<LayourProps>) {
  const { lang, children } = props

  const pathname = usePathname()?.replace(`/${lang}`, '')

  async function initializeTailwindElements() {
    const { initTE, Button, Collapse, Dropdown, Input, Modal, Select, Tab } =
      await import('tw-elements')
    await initTE({ Dropdown, Button, Modal, Input, Select, Collapse, Tab })
  }

  useAppBootstrap({ initGA: true, initTE: initializeTailwindElements })

  function isHeaderVisible() {
    return (
      pathname &&
      (ROUTES[pathname]?.isHeaderVisible ||
        ROUTES[pathname]?.isHeaderVisible === undefined)
    )
  }

  function isFooterVisible() {
    return (
      pathname &&
      (ROUTES[pathname]?.isFooterVisible ||
        ROUTES[pathname]?.isFooterVisible === undefined)
    )
  }

  return (
    <>
      {/* <TWElementsInit /> */}
      <NewsBanner content={NEWS} />
      {isHeaderVisible() && <Header lang={lang} />}
      <main>{children}</main>
      {isFooterVisible() && <Footer lang={lang} />}
    </>
  )
}
