'use client'

import '../../styles/index.css'
import '../../tauri/tauri-web-adapter'

import AppEventContext, {
  AppEvent,
} from '@keadex/keadex-mina/src/context/AppEventContext'
import { router } from '@keadex/keadex-mina/src/core/router/router'
import store from '@keadex/keadex-mina/src/core/store/store'
import initi18n from '@keadex/keadex-mina/src/i18n'
import { useForceUpdate } from '@keadex/keadex-ui-kit/cross'
import { clearOPFSTempDir, initConsole } from '@keadex/keadex-utils'
import useEventEmitter from 'ahooks/lib/useEventEmitter'
import { memo, useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import {
  Button,
  Collapse,
  Dropdown,
  initTE,
  Input,
  Modal,
  Select,
} from 'tw-elements'

import init from '../../../src-rust/pkg'

initConsole()

initi18n({
  backend: {
    loadPath: '/_next/static/keadex-mina/locales/{{lng}}/{{ns}}.json',
  },
})

export type MinaLiveProps = {
  scriptPath: string
}

export const MinaLive = memo<MinaLiveProps>(({ scriptPath }) => {
  // minaAppInitialized must be a ref since we have to be sure of initializing the Rust Mina app
  // only once. Initializing it multiple times will throw an error due to some Rust dependencies.
  const minaAppInitialized = useRef(false)
  const teInitialized = useRef(false)
  const wasmInitialized = useRef(false)
  const event$ = useEventEmitter<AppEvent>()
  const { forceUpdate } = useForceUpdate()

  useEffect(() => {
    if (!wasmInitialized.current) {
      wasmInitialized.current = true
      init()
        .then((wasmModule) => {
          console.debug(`Wasm module loaded`)
          // Clear OPFS temp dir
          clearOPFSTempDir()
          // setTimeout() needed due to tw-elements@1.0.0-beta2 bug:
          //  - https://github.com/mdbootstrap/Tailwind-Elements/issues/1615
          //  - https://github.com/mdbootstrap/Tailwind-Elements/issues/1685
          setTimeout(() => {
            if (!teInitialized.current) {
              console.debug(`Tailwind Elements initialized`)
              initTE({ Dropdown, Button, Modal, Input, Select, Collapse })
            }
            teInitialized.current = true
          }, 1000)

          if (!minaAppInitialized.current) {
            wasmModule?.init_app(scriptPath)
            console.debug(`Mina app initialized`)
            forceUpdate()
          }
          minaAppInitialized.current = true
        })
        .catch((error) => {
          console.error(`Error loading Wasm module:`, error)
        })
    }
  }, [])

  return (
    <>
      {
        // eslint-disable-next-line react-hooks/refs
        minaAppInitialized.current && (
          <Provider store={store}>
            <AppEventContext.Provider value={event$}>
              <RouterProvider router={router} />
            </AppEventContext.Provider>
          </Provider>
        )
      }
      {
        // eslint-disable-next-line react-hooks/refs
        !minaAppInitialized.current && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
            Mina is loading...
          </div>
        )
      }
    </>
  )
})

export default MinaLive
