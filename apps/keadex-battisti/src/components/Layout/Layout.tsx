'use client'

import dynamic from 'next/dynamic'
import { PropsWithChildren } from 'react'
import { useAppBootstrap } from '@keadex/keadex-ui-kit/cross'

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

  async function initializeTailwindElements() {
    const { initTE, Button, Collapse, Dropdown, Input, Modal, Select } =
      await import('tw-elements')
    await initTE({ Dropdown, Button, Modal, Input, Select, Collapse })
  }

  useAppBootstrap({ initGA: true, initTE: initializeTailwindElements })

  return (
    <>
      {/* <TWElementsInit /> */}
      <Header lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  )
}
