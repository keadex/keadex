import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export interface WindowTitlebarButtonProps {
  icon: IconProp
  id: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export const WindowTitlebarButton = React.memo(
  (props: WindowTitlebarButtonProps) => {
    return (
      <button
        type="button"
        className={`h-full w-10 p-1 ${props.className}`}
        id={props.id}
        onClick={(e) => {
          if (props.onClick) props.onClick(e)
        }}
      >
        <FontAwesomeIcon icon={props.icon} />
      </button>
    )
  }
)

export default WindowTitlebarButton
