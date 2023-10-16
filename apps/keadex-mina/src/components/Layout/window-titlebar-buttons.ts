import type { WindowTitlebarButtonProps } from '@keadex/keadex-ui-kit/desktop'
import {
  faXmark,
  faWindowMaximize,
  faWindowRestore,
  faMinus,
} from '@fortawesome/free-solid-svg-icons'
import { appWindow } from '@tauri-apps/api/window'
import { UnlistenFn } from '@tauri-apps/api/event'

function createButtons(
  resized: boolean,
  setResized: React.Dispatch<React.SetStateAction<boolean>>,
  setRightButtons: React.Dispatch<
    React.SetStateAction<WindowTitlebarButtonProps[]>
  >
) {
  const buttons: WindowTitlebarButtonProps[] = []
  appWindow.isMaximized().then((isMaximized) => {
    if (resized) setResized(false)
    buttons.push({
      id: 'minimize-close',
      icon: faMinus,
      className: 'text-accent-primary hover:bg-accent-third',
      onClick: () => appWindow.minimize(),
    })
    if (isMaximized) {
      buttons.push({
        id: 'restore-btn',
        icon: faWindowRestore,
        className: 'text-accent-primary hover:bg-accent-third',
        onClick: () => appWindow.unmaximize(),
      })
    } else {
      buttons.push({
        id: 'maximize-btn',
        icon: faWindowMaximize,
        className: 'text-accent-primary hover:bg-accent-third',
        onClick: () => appWindow.maximize(),
      })
    }
    buttons.push({
      id: 'restore-close',
      icon: faXmark,
      className: 'text-accent-primary hover:bg-red-600',
      onClick: () => appWindow.close(),
    })
    setRightButtons(buttons)
  })
}

export default (
  resized: boolean,
  setResized: React.Dispatch<React.SetStateAction<boolean>>,
  unlistenRef: React.MutableRefObject<UnlistenFn | undefined>,
  setRightButtons: React.Dispatch<
    React.SetStateAction<WindowTitlebarButtonProps[]>
  >
) => {
  appWindow
    .onResized(() => {
      if (!resized) setResized(true)
      console.debug('Layout -> on window resized()')
      createButtons(resized, setResized, setRightButtons)
    })
    .then((unlisten) => {
      unlistenRef.current = unlisten
    })
  createButtons(resized, setResized, setRightButtons)
}
