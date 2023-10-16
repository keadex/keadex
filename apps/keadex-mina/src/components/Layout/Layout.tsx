import {
  ContextMenu,
  DropdownMenuProps,
  ModalRoot,
  useModal,
} from '@keadex/keadex-ui-kit/cross'
import type { WindowTitlebarButtonProps } from '@keadex/keadex-ui-kit/desktop'
import { Window, WindowTitlebar } from '@keadex/keadex-ui-kit/desktop'
import { UnlistenFn } from '@tauri-apps/api/event'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import icon from '../../../src-tauri/icons/icon.png'
import AppEventContext from '../../context/AppEventContext'
import ROUTES from '../../core/router/routes'
import { useAppDispatch, useAppSelector } from '../../core/store/hooks'
import AppMenu from '../AppMenu/AppMenu'
import initWindowTitlebarButtons from './window-titlebar-buttons'

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

  const [rightButtons, setRightButtons] = useState<WindowTitlebarButtonProps[]>(
    []
  )
  const [resized, setResized] = useState(false)
  const [windowTitlebarMenu, setWindowTitlebarMenu] =
    useState<DropdownMenuProps>(emptyWindowTitlebarMenu)
  const [isAppMenuVisible, setIsAppMenuVisible] = useState(false)
  const unlistenRef = useRef<UnlistenFn>()

  useEffect(() => {
    console.debug('Layout -> useEffect()')
    if (!rightButtons || rightButtons.length === 0) {
      initWindowTitlebarButtons(
        resized,
        setResized,
        unlistenRef,
        setRightButtons
      )
    }
    const unlisten = unlistenRef.current
    return () => {
      if (unlisten) unlisten()
    }
  }, [resized, rightButtons])

  useEffect(() => {
    console.debug('Location changed!', location.pathname)
    if (ROUTES[location.pathname]) {
      setWindowTitlebarMenu(
        ROUTES[location.pathname].titlebarMenuFactory
          ? ROUTES[location.pathname].titlebarMenuFactory!(
              t,
              context,
              navigate,
              location,
              {
                showModal,
                hideModal,
                dispatch,
                currentProjectRoot: project?.project_settings.root,
              }
            )
          : emptyWindowTitlebarMenu
      )
      setIsAppMenuVisible(
        ROUTES[location.pathname].isAppMenuVisible !== undefined
          ? ROUTES[location.pathname].isAppMenuVisible!
          : false
      )
    } else {
      setWindowTitlebarMenu(emptyWindowTitlebarMenu)
    }
  }, [location])

  return (
    <div className="container max-w-none font-sans">
      {modal}
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
        />
        <div className="absolute bottom-0 left-0 right-0 top-8 overflow-auto">
          <AppMenu visible={isAppMenuVisible}>
            <Outlet />
          </AppMenu>
        </div>
      </Window>
    </div>
  )
})

export default Layout
