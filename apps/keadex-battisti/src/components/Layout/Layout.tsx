'use client'

import { NewsBanner, useAppBootstrap } from '@keadex/keadex-ui-kit/cross'
import { findRoute } from '@keadex/keadex-ui-kit/core'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'
import { NEWS } from '../../core/news'
import ROUTES from '../../core/routes'
import { initConsole } from '@keadex/keadex-utils'

const Header = dynamic(() => import('../Header/Header'))
const Footer = dynamic(() => import('../Footer/Footer'))

export type LayourProps = {
  lang: string
}

initConsole()

export default function Layout(props: PropsWithChildren<LayourProps>) {
  const { lang, children } = props

  const pathname = usePathname()?.replace(`/${lang}`, '')
  const foundRoute = pathname ? findRoute(pathname, ROUTES) : undefined

  async function initializeTailwindElements() {
    const { initTE, Button, Collapse, Dropdown, Input, Modal, Select, Tab } =
      await import('tw-elements')
    await initTE({ Dropdown, Button, Modal, Input, Select, Collapse, Tab })
  }

  useAppBootstrap({ initGA: true, initTE: initializeTailwindElements })

  function isNewsbarVisible() {
    return (
      !foundRoute ||
      (foundRoute &&
        (foundRoute.isNewsbarVisible ||
          foundRoute.isNewsbarVisible === undefined))
    )
  }

  function isHeaderVisible() {
    return (
      !foundRoute ||
      (foundRoute &&
        (foundRoute.isHeaderVisible ||
          foundRoute.isHeaderVisible === undefined))
    )
  }

  function isFooterVisible() {
    return (
      !foundRoute ||
      (foundRoute &&
        (foundRoute.isFooterVisible ||
          foundRoute.isFooterVisible === undefined))
    )
  }

  return (
    <>
      {/* <TWElementsInit /> */}
      <ToastContainer
        autoClose={4000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme={'dark'}
        position={'bottom-right'}
      />
      {isNewsbarVisible() && <NewsBanner content={NEWS} />}
      {isHeaderVisible() && <Header lang={lang} />}
      <main>{children}</main>
      {isFooterVisible() && <Footer lang={lang} />}
    </>
  )
}
