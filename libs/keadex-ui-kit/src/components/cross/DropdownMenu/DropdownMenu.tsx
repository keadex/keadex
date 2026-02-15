'use client'

import type { JSX } from 'react'
import { memo, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { DropdownMenuItemProps } from './DropdownMenuItem'
import DropdownMenuItem from './DropdownMenuItem'

export interface DropdownMenuProps {
  className?: string
  menuItemsProps: DropdownMenuItemProps[]
}

export const DropdownMenu = memo((props: DropdownMenuProps) => {
  const [openedMenu, setOpenedMenu] = useState(0)
  const [lastOpenedMenu, setLastOpenedMenu] = useState('')

  function increaseOpenedMenu() {
    setOpenedMenu((prev) => prev + 1)
  }

  function decreaseOpenedMenu() {
    setOpenedMenu((prev) => prev - 1)
  }

  function atLeastOneOpenedMenu(): boolean {
    return openedMenu > 0
  }

  function renderMenuItems(): JSX.Element[] {
    const renderedMenuItems: JSX.Element[] = []
    if (props.menuItemsProps && props.menuItemsProps.length > 0) {
      for (const menuItemProps of props.menuItemsProps) {
        renderedMenuItems.push(
          <DropdownMenuItem
            {...menuItemProps}
            key={menuItemProps.id}
            increaseOpenedMenu={increaseOpenedMenu}
            decreaseOpenedMenu={decreaseOpenedMenu}
            atLeastOneOpenedMenu={atLeastOneOpenedMenu}
            lastOpenedMenu={lastOpenedMenu}
            setLastOpenedMenu={setLastOpenedMenu}
          />,
        )
      }
    }
    return renderedMenuItems
  }

  return (
    <div
      className={twMerge(
        `dropdown-menu group flex`,
        atLeastOneOpenedMenu() ? 'open' : '',
        props.className ?? '',
      )}
    >
      {renderMenuItems()}
    </div>
  )
})

export default DropdownMenu
