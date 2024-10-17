'use client'

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
import router from '@keadex/keadex-mina/src//core/router/router'
import store from '@keadex/keadex-mina/src//core/store/store'
import initi18n from '@keadex/keadex-mina/src//i18n'
import '@keadex/keadex-mina/src/styles/index.css'

initi18n({
  backend: {
    loadPath: '/_next/static/locales/{{lng}}/{{ns}}.json',
  },
})

export const MinaLive = React.memo(() => {
  const teInitialized = useRef(false)
  const event$ = useEventEmitter<AppEvent>()

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
  }, [])

  return (
    <Provider store={store}>
      <AppEventContext.Provider value={event$}>
        <RouterProvider router={router} />
      </AppEventContext.Provider>
    </Provider>
  )
})

export default MinaLive
