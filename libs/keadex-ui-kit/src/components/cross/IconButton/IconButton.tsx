'use client'

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDataAttributes } from '@keadex/keadex-utils'
import type { ButtonHTMLAttributes } from 'react'
import { memo } from 'react'
import { twMerge } from 'tailwind-merge'

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconProp
  classNameIcon?: string
  classNameContent?: string
}

export const IconButton = memo((props: IconButtonProps) => {
  const { icon, classNameIcon, classNameContent, ...otherProps } = props

  const dataAttributes = getDataAttributes(props)
  return (
    <button
      {...otherProps}
      {...dataAttributes}
      className={twMerge(
        `text-accent-secondary hover:text-accent-primary [&.active]:text-accent-primary disabled:hover:text-accent-secondary disabled:opacity-50`,
        props.className,
      )}
    >
      <FontAwesomeIcon icon={icon ?? faXmark} className={classNameIcon ?? ''} />
      <div className={classNameContent}>{props.children}</div>
    </button>
  )
})

export default IconButton
