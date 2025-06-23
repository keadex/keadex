'use client'

import '../../tauri/tauri-web-adapter'
import useEventEmitter from 'ahooks/lib/useEventEmitter'
import React, { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import {
  Button,
  Collapse,
  Dropdown,
  Input,
  Modal,
  Select,
  initTE,
} from 'tw-elements'
import AppEventContext, {
  AppEvent,
} from '@keadex/keadex-mina/src/context/AppEventContext'
import { router } from '@keadex/keadex-mina/src/core/router/router'
import store from '@keadex/keadex-mina/src/core/store/store'
import initi18n from '@keadex/keadex-mina/src/i18n'
import '@keadex/keadex-mina/src/styles/index.css'
import { init_app } from '../../../src-rust/pkg'
import { useForceUpdate } from '@keadex/keadex-ui-kit/cross'
import { initConsole } from '@keadex/keadex-utils'

initConsole()

initi18n({
  backend: {
    loadPath: '/_next/static/keadex-mina/locales/{{lng}}/{{ns}}.json',
  },
})

// eslint-disable-next-line @typescript-eslint/ban-types
export type MinaLiveProps = {}

export const MinaLive = React.memo<MinaLiveProps>((props) => {
  // minaAppInitialized must be a ref since we have to be sure of initializing the Rust Mina app
  // only once. Initializing it multiple times will throw an error due to some Rust dependencies.
  const minaAppInitialized = useRef(false)
  const teInitialized = useRef(false)
  const event$ = useEventEmitter<AppEvent>()
  const { forceUpdate } = useForceUpdate()

  useEffect(() => {
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
      init_app()
      console.debug(`Mina app initialized`)
      forceUpdate()
    }
    minaAppInitialized.current = true
  }, [])

  return (
    <>
      {minaAppInitialized.current && (
        <Provider store={store}>
          <AppEventContext.Provider value={event$}>
            <RouterProvider router={router} />
          </AppEventContext.Provider>
        </Provider>
      )}
      {!minaAppInitialized.current && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
          Mina is loading...
        </div>
      )}
    </>
  )
})

export default MinaLive
