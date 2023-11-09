import type { WindowTitlebarButtonProps } from '@keadex/keadex-ui-kit/desktop'
import {
  faXmark,
  faWindowMaximize,
  faWindowRestore,
  faMinus,
} from '@fortawesome/free-solid-svg-icons'
import { appWindow } from '@tauri-apps/api/window'

export function createButtons(
  setRightButtons: React.Dispatch<
    React.SetStateAction<WindowTitlebarButtonProps[]>
  >,
  isOnResizedDisabled: React.MutableRefObject<boolean>,
) {
  const buttons: WindowTitlebarButtonProps[] = []
  isOnResizedDisabled.current = true
  appWindow.isMaximized().then((isMaximized) => {
    isOnResizedDisabled.current = false
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
