import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { type TFunction } from 'i18next'
import type { JSX } from 'react'
import { memo } from 'react'
import { Location, NavigateFunction } from 'react-router-dom'

import DropdownMenu, {
  DropdownMenuProps,
} from '../../cross/DropdownMenu/DropdownMenu'
import type { WindowTitlebarButtonProps } from './WindowTitlebarButton'
import WindowTitlebarButton from './WindowTitlebarButton'

export type WindowTitlebarMenuFactory<T, K> = (
  t: TFunction<'translation', undefined>,
  context: EventEmitter<T> | null,
  navigate: NavigateFunction,
  location: Location,
  data: K,
) => DropdownMenuProps

export interface WindowTitlebarProps {
  icon: string
  menuProps: DropdownMenuProps
  rightButtonsProps?: WindowTitlebarButtonProps[]
  title?: string | JSX.Element
}

export const WindowTitlebar = memo((props: WindowTitlebarProps) => {
  function renderRightButtons() {
    const renderedRightButtons: JSX.Element[] = []
    if (props.rightButtonsProps && props.rightButtonsProps.length > 0) {
      for (const rightButtonProps of props.rightButtonsProps) {
        renderedRightButtons.push(
          <WindowTitlebarButton
            {...rightButtonProps}
            key={rightButtonProps.id}
          />,
        )
      }
    }
    return renderedRightButtons
  }

  return (
    <nav
      data-tauri-drag-region
      className="window-titlebar window__inner-border bg-dark-primary fixed left-0 right-0 top-0 z-10 flex h-8 w-full flex-row items-center border-l-0 border-r-0 border-t-0 relative"
    >
      {props.title && (
        <div className="absolute w-full text-center pointer-events-none">
          {props.title}
        </div>
      )}
      <div data-tauri-drag-region className="flex basis-3/4 items-center">
        <img src={props.icon} className="ml-2 h-5 w-5" alt="Keadex Mina icon" />
        <div className="ml-2 flex">
          <DropdownMenu menuItemsProps={props.menuProps.menuItemsProps} />
        </div>
      </div>
      <div data-tauri-drag-region className="basis-1/4 text-right">
        {renderRightButtons()}
      </div>
    </nav>
  )
})

export default WindowTitlebar
