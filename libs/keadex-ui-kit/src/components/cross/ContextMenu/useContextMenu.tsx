'use client'

import { useEffect, useCallback, useState } from 'react'
import { IEvent } from 'fabric/fabric-impl'
import { DropdownMenuItemProps } from '@keadex/keadex-ui-kit/cross'

export interface KeadexContextMenuEvent {
  sourceEvent: IEvent<Event>
  pageX: number
  pageY: number
  menuItems: DropdownMenuItemProps[]
}

function isKeadexContextMenuCustomEvent(
  obj: any,
): obj is CustomEvent<KeadexContextMenuEvent> {
  if (obj instanceof CustomEvent) {
    return (
      obj instanceof CustomEvent &&
      Object.keys(obj.detail).includes('menuItems')
    )
  }
  return false
}

const useContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 })
  const [show, setShow] = useState(false)
  const [contextMenuItems, setContextMenuItems] = useState<
    DropdownMenuItemProps[]
  >([])

  const handleContextMenu = useCallback(
    (event: MouseEvent | CustomEvent<KeadexContextMenuEvent>) => {
      event.preventDefault()
      if (isKeadexContextMenuCustomEvent(event)) {
        const x = event.detail.pageX
        const y = event.detail.pageY
        setContextMenuItems(event.detail.menuItems)
        setAnchorPoint({ x, y })
        setShow(true)
      }
    },
    [setShow, setAnchorPoint],
  )

  const handleClick = useCallback(() => (show ? setShow(false) : null), [show])

  useEffect(() => {
    document.addEventListener('click', handleClick)
    document.addEventListener('contextmenu', handleContextMenu)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  })
  return { anchorPoint, show, contextMenuItems }
}

export default useContextMenu
