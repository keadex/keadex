import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { MouseEventHandler } from 'react'
import { memo } from 'react'
import { twMerge } from 'tailwind-merge'

export interface WindowTitlebarButtonProps {
  icon: IconProp
  id: string
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const WindowTitlebarButton = memo((props: WindowTitlebarButtonProps) => {
  return (
    <button
      type="button"
      className={twMerge(`h-full w-10 p-1`, props.className)}
      id={props.id}
      onClick={(e) => {
        if (props.onClick) props.onClick(e)
      }}
    >
      <FontAwesomeIcon icon={props.icon} />
    </button>
  )
})

export default WindowTitlebarButton
