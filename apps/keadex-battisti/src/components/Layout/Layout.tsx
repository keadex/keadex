'use client'

import { NewsBanner, useAppBootstrap } from '@keadex/keadex-ui-kit/cross'
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

  async function initializeTailwindElements() {
    const { initTE, Button, Collapse, Dropdown, Input, Modal, Select, Tab } =
      await import('tw-elements')
    await initTE({ Dropdown, Button, Modal, Input, Select, Collapse, Tab })
  }

  useAppBootstrap({ initGA: true, initTE: initializeTailwindElements })

  function isNewsbarVisible() {
    return (
      !pathname ||
      (pathname &&
        (ROUTES[pathname]?.isNewsbarVisible ||
          ROUTES[pathname]?.isNewsbarVisible === undefined))
    )
  }

  function isHeaderVisible() {
    return (
      !pathname ||
      (pathname &&
        (ROUTES[pathname]?.isHeaderVisible ||
          ROUTES[pathname]?.isHeaderVisible === undefined))
    )
  }

  function isFooterVisible() {
    return (
      !pathname ||
      (pathname &&
        (ROUTES[pathname]?.isFooterVisible ||
          ROUTES[pathname]?.isFooterVisible === undefined))
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
