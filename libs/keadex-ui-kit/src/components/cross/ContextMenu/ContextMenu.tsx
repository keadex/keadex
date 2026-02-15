'use client'

import { useEffect, useRef, useState } from 'react'

import DropdownMenu from '../DropdownMenu/DropdownMenu'
import useContextMenu from './useContextMenu'

export const ContextMenu = () => {
  const { anchorPoint, show, contextMenuItems } = useContextMenu()
  const currShow = useRef<boolean | null>(undefined)
  const [dropdown, setDropdown] = useState(<></>)

  // Following is a way to avoid flickering of the context menu when showed
  // eslint-disable-next-line react-hooks/refs
  if (currShow.current !== show) {
    // eslint-disable-next-line react-hooks/refs
    currShow.current = show
  }

  useEffect(() => {
    if (currShow.current !== undefined) {
      if (currShow.current) {
        setDropdown(
          <div
            hidden={!show}
            className="context-menu absolute"
            style={{ top: anchorPoint.y, left: anchorPoint.x }}
          >
            <DropdownMenu menuItemsProps={contextMenuItems} />
          </div>,
        )
      } else {
        setDropdown(<></>)
      }
    }
    // eslint-disable-next-line react-hooks/refs
  }, [currShow.current])

  return dropdown
}

export default ContextMenu
