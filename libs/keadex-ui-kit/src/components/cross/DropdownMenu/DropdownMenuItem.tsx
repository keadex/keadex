'use client'

import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Dispatch, JSX, MouseEventHandler, SetStateAction } from 'react'
import { memo, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface DropdownMenuItemProps {
  className?: string
  buttonClassName?: string
  id: string
  isHeaderMenuItem?: boolean
  isSepator?: boolean
  label?: string | JSX.Element
  hidden?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  alwaysOpen?: boolean
  subMenuItems?: DropdownMenuItemProps[]
  increaseOpenedMenu?: () => void
  decreaseOpenedMenu?: () => void
  atLeastOneOpenedMenu?: () => boolean
  lastOpenedMenu?: string
  setLastOpenedMenu?: Dispatch<SetStateAction<string>>
  disabled?: boolean
}

const DROPDOWN_HIDE_EVENT = 'hide.te.dropdown'
const DROPDOWN_SHOW_EVENT = 'show.te.dropdown'

export const DropdownMenuItem = memo((props: DropdownMenuItemProps) => {
  const dropdownEl = useRef<HTMLButtonElement>(null)
  const [dropdownOpened, setDropdownOpened] = useState(false)

  function renderSubMenuItem(
    subMenuItemProps: DropdownMenuItemProps,
  ): JSX.Element {
    let renderedSubMenuItem
    if (subMenuItemProps.isSepator) {
      renderedSubMenuItem = (
        <li className="relative" key={subMenuItemProps.id}>
          <span className="bg-third my-1 block h-px w-full"></span>
        </li>
      )
    } else {
      renderedSubMenuItem = (
        <li className="relative" key={subMenuItemProps.id}>
          <button
            disabled={
              subMenuItemProps.disabled !== undefined &&
              subMenuItemProps.disabled
            }
            id={subMenuItemProps.id}
            className={`
            hover:bg-link
            flex
            w-full
            items-center
            whitespace-nowrap
            px-4
            py-1
            text-left
            text-sm
            hover:text-white
          `}
            data-te-dropdown-item-ref
            onClick={(e) => {
              if (subMenuItemProps.onClick) {
                subMenuItemProps.onClick(e)
              }
            }}
          >
            {subMenuItemProps.subMenuItems &&
              subMenuItemProps.subMenuItems.length > 0 && (
                <>
                  <span className="mr-16 basis-11/12 pr-1">
                    {subMenuItemProps.label}
                  </span>
                  <span className="basis-1/12 text-right">
                    <FontAwesomeIcon icon={faAngleRight} />
                  </span>
                </>
              )}
            {(!subMenuItemProps.subMenuItems ||
              subMenuItemProps.subMenuItems.length === 0) &&
              subMenuItemProps.label}
          </button>
          {renderSubMenuItems(
            subMenuItemProps.isHeaderMenuItem,
            subMenuItemProps.id,
            subMenuItemProps.subMenuItems,
          )}
        </li>
      )
    }
    return renderedSubMenuItem
  }

  function renderSubMenuItems(
    parentIsHeaderMenuItem: boolean | undefined,
    id: string,
    subMenuItems?: DropdownMenuItemProps[],
  ) {
    const renderedSubMenuItems: JSX.Element[] = []

    if (subMenuItems && subMenuItems.length > 0) {
      for (const subMenuItem of subMenuItems) {
        renderedSubMenuItems.push(renderSubMenuItem(subMenuItem))
      }
      return (
        <ul
          className={twMerge(
            `
            bg-secondary
            text-accent-primary
            absolute
            z-50
            m-0
            w-auto
            min-w-max
            list-none
            rounded-md
            border-none
            bg-clip-padding
            py-2
            shadow-[0_1px_2px_rgba(0,0,0,0.6)]
            data-te-dropdown-show:block`,
            parentIsHeaderMenuItem
              ? ' dropdown-menu float-left hidden origin-top-left'
              : ' right-px top-0',
          )}
          id={`menu-${id}`}
          aria-labelledby={id}
          data-te-dropdown-menu-ref
        >
          {renderedSubMenuItems}
        </ul>
      )
    } else {
      return <div data-te-dropdown-menu-ref></div>
    }
  }

  const dropdownEventListener = (ev: Event) => {
    if (
      props.increaseOpenedMenu &&
      props.setLastOpenedMenu &&
      props.decreaseOpenedMenu
    )
      if (ev.type === DROPDOWN_SHOW_EVENT) {
        setDropdownOpened(true)
        props.increaseOpenedMenu()
        props.setLastOpenedMenu(props.id)
      } else {
        setDropdownOpened(false)
        props.decreaseOpenedMenu()
      }
  }

  useEffect(() => {
    const currentDropdownEl = dropdownEl.current
    currentDropdownEl?.addEventListener(
      DROPDOWN_HIDE_EVENT,
      dropdownEventListener,
    )
    currentDropdownEl?.addEventListener(
      DROPDOWN_SHOW_EVENT,
      dropdownEventListener,
    )
    if (props.alwaysOpen && !dropdownOpened) {
      currentDropdownEl?.dispatchEvent(new MouseEvent('click'))
    } else if (props.lastOpenedMenu !== props.id && dropdownOpened) {
      currentDropdownEl?.dispatchEvent(new MouseEvent('click'))
    }
    return () => {
      currentDropdownEl?.removeEventListener(
        DROPDOWN_HIDE_EVENT,
        dropdownEventListener,
      )
      currentDropdownEl?.removeEventListener(
        DROPDOWN_SHOW_EVENT,
        dropdownEventListener,
      )
    }
  })

  return (
    <div
      className={twMerge(`relative`, props.className ?? '')}
      key={props.id}
      data-te-dropdown-ref
    >
      <button
        className={twMerge(
          !dropdownOpened ? ' bg-dark-primary text-accent-primary' : '',
          `hover:bg-primary
        flex
        items-center
        whitespace-nowrap
        rounded-md
        px-2
        py-0.5
        text-sm hover:text-white
        hover:shadow-[0_1px_2px_rgba(0,0,0,0.6)]
        focus:outline-hidden
        focus:ring-0`,
          dropdownOpened ? ' bg-primary show text-white' : '',
          props.hidden ? ' h-0 opacity-0' : '',
          props.buttonClassName ? ` ${props.buttonClassName}` : '',
        )}
        type="button"
        id={props.id}
        aria-expanded="false"
        ref={dropdownEl}
        data-te-dropdown-toggle-ref
        data-te-dropdown-animation="off"
        onMouseEnter={(e) => {
          if (
            props.atLeastOneOpenedMenu &&
            props.atLeastOneOpenedMenu() &&
            !dropdownOpened
          ) {
            e.target.dispatchEvent(new MouseEvent('click'))
          }
        }}
      >
        {props.label}
      </button>
      {renderSubMenuItems(props.isHeaderMenuItem, props.id, props.subMenuItems)}
    </div>
  )
})

export default DropdownMenuItem
