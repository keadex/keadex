import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { getDataAttributes } from '@keadex/keadex-utils'

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconProp
  classNameIcon?: string
  classNameContent?: string
}

export const IconButton = React.memo((props: IconButtonProps) => {
  const { icon, classNameIcon, classNameContent, ...otherProps } = props

  const dataAttributes = getDataAttributes(props)
  return (
    <button
      {...otherProps}
      {...dataAttributes}
      className={`${props.className} text-accent-secondary hover:text-accent-primary [&.active]:text-accent-primary disabled:hover:text-accent-secondary disabled:opacity-50`}
    >
      <FontAwesomeIcon icon={icon ?? faXmark} className={classNameIcon ?? ''} />
      <div className={classNameContent}>{props.children}</div>
    </button>
  )
})

export default IconButton
