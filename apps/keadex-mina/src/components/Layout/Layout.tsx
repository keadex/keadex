import {
  ContextMenu,
  DropdownMenuProps,
  ModalRoot,
  useModal,
} from '@keadex/keadex-ui-kit/cross'
import type { WindowTitlebarButtonProps } from '@keadex/keadex-ui-kit/desktop'
import {
  Window,
  WindowTitlebar,
  findRoute,
} from '@keadex/keadex-ui-kit/desktop'
import { TauriEvent, UnlistenFn } from '@tauri-apps/api/event'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { onOpenUrl } from '@tauri-apps/plugin-deep-link'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import icon from '../../../src-tauri/icons/icon.png'
import AppEventContext from '../../context/AppEventContext'
import { useDeepLinkRouter } from '../../core/router/router'
import ROUTES from '../../core/router/routes'
import { useAppDispatch, useAppSelector } from '../../core/store/hooks'
import AppMenu, { AppMenuCommands } from '../AppMenu/AppMenu'
import { createButtons } from './window-titlebar-buttons'

const appWindow = getCurrentWebviewWindow()

/* eslint-disable-next-line */
export interface LayoutProps {}

const emptyWindowTitlebarMenu: DropdownMenuProps = {
  menuItemsProps: [],
}

export const Layout = React.memo((props: LayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const context = useContext(AppEventContext)
  const { modal, showModal, hideModal } = useModal()
  const dispatch = useAppDispatch()
  const project = useAppSelector((state) => state.project.value)
  const { routeDeepLink, modalSafeExit } = useDeepLinkRouter()

  const [rightButtons, setRightButtons] = useState<WindowTitlebarButtonProps[]>(
    [],
  )
  const [windowTitlebarMenu, setWindowTitlebarMenu] =
    useState<DropdownMenuProps>(emptyWindowTitlebarMenu)
  const [isAppMenuVisible, setIsAppMenuVisible] = useState(false)
  const isOnResizedDisabled = useRef(true)
  const isDeepLinkInitializing = useRef(false)
  const deepLinkListeners = useRef<{
    [path: string]: { unsubscribed: boolean }
  }>({})
  const appMenuRef = useRef<AppMenuCommands>(null)

  function clearDeepLinkListeners() {
    for (const id of Object.keys(deepLinkListeners.current)) {
      if (deepLinkListeners.current[id].unsubscribed)
        delete deepLinkListeners.current[id]
    }
  }

  // The following "complex" deep link listener logic is required due to
  // an unexpected behaviour of the onOpenUrl() Tauri api: it triggers
  // the listener also during the initialization; the unlistener is
  // asynchronus and this causes the listener triggering during the unlistening.
  useEffect(() => {
    console.debug('Deep link initializing')
    const id = uuidv4()
    deepLinkListeners.current[id] = { unsubscribed: false }
    isDeepLinkInitializing.current = true
    console.debug(deepLinkListeners.current)

    const unlistenDeepLink = onOpenUrl((requestedUrls) => {
      if (!deepLinkListeners.current[id].unsubscribed) {
        if (!isDeepLinkInitializing.current) {
          if (requestedUrls && requestedUrls.length > 0) {
            const deepLink = requestedUrls[0]
            routeDeepLink(deepLink)
          }
        }
        console.debug('Deep link initialized')
        isDeepLinkInitializing.current = false
        clearDeepLinkListeners()
      }
    })

    return () => {
      console.debug('Deep link unlisten')
      if (unlistenDeepLink) {
        deepLinkListeners.current[id] = { unsubscribed: true }
        unlistenDeepLink.then((f) => f())
      }
    }
  }, [location])

  useEffect(() => {
    console.debug('Layout -> useEffect()')
    let unlistenWindowResized: Promise<UnlistenFn> | null
    if (!rightButtons || rightButtons.length === 0) {
      createButtons(setRightButtons, isOnResizedDisabled, showModal, t)
      unlistenWindowResized = appWindow.listen(
        TauriEvent.WINDOW_RESIZED,
        () => {
          console.debug(
            `Layout -> on window resized() ${isOnResizedDisabled.current}`,
          )
          if (!isOnResizedDisabled.current) {
            createButtons(setRightButtons, isOnResizedDisabled, showModal, t)
          }
        },
      )
    }
    return () => {
      if (unlistenWindowResized) unlistenWindowResized.then((f) => f())
    }
  }, [])

  useEffect(() => {
    console.debug('Location changed!', location.pathname)
    const foundRoute = findRoute(location.pathname, ROUTES)
    if (foundRoute) {
      setWindowTitlebarMenu(
        foundRoute.titlebarMenuFactory
          ? foundRoute.titlebarMenuFactory!(t, context, navigate, location, {
              showModal,
              hideModal,
              dispatch,
              currentProjectRoot: project?.project_settings.root,
            })
          : emptyWindowTitlebarMenu,
      )
      setIsAppMenuVisible(
        foundRoute.isAppMenuVisible !== undefined
          ? foundRoute.isAppMenuVisible
          : false,
      )
      // Force the collapse of the app menu only if it is strictly required
      // by the new route, otherwise leave it as-is.
      if (foundRoute.isAppMenuCollapsed) appMenuRef.current?.collapse()
    } else {
      setIsAppMenuVisible(true)
      setWindowTitlebarMenu(emptyWindowTitlebarMenu)
    }
  }, [location])

  return (
    <div className="container max-w-none">
      {modal}
      {modalSafeExit}
      <ContextMenu />
      <ToastContainer
        autoClose={4000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme={'dark'}
        position={'bottom-right'}
      />
      <ModalRoot />
      <Window>
        <WindowTitlebar
          rightButtonsProps={rightButtons}
          icon={icon}
          menuProps={windowTitlebarMenu}
          title="Keadex Mina"
        />
        <div className="absolute bottom-0 left-0 right-0 top-8 overflow-auto">
          <AppMenu visible={isAppMenuVisible} ref={appMenuRef}>
            <Outlet />
          </AppMenu>
        </div>
      </Window>
    </div>
  )
})

export default Layout
