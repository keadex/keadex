'use client'

import { addBasePath } from 'next/dist/client/add-base-path'
import { Search } from 'nextra/components'
import { useEffect, useState } from 'react'

import ROUTES, { DOCS } from '../../core/routes'

declare global {
  interface Window {
    pagefind?: any
  }
}

export function SearchNextra() {
  const [initialized, setInitialized] = useState(false)

  async function importPagefind() {
    window.pagefind = await import(
      /* webpackIgnore: true */ addBasePath('/_pagefind/pagefind.js')
    )
    await window.pagefind.options({
      baseUrl: ROUTES[DOCS].path,
    })
    setInitialized(true)
  }

  useEffect(() => {
    importPagefind()
  }, [])

  return initialized && <Search />
}
