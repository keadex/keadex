'use client'

import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { DetailedHTMLProps, InputHTMLAttributes, MouseEvent } from 'react'
import { memo, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import Spinner from '../Spinner/Spinner'

export interface InputButtonProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  fixedWidth?: boolean
  loading?: boolean
  onIconClick?: () => void
  icon?: IconDefinition
}

export const InputButton = memo((props: InputButtonProps) => {
  const { fixedWidth, loading, onIconClick, icon, ...otherProps } = props
  const [value, setValue] = useState<string>()

  function isActive(): boolean {
    if (fixedWidth !== undefined && fixedWidth) {
      return true
    } else {
      return value !== undefined && value !== ''
    }
  }

  function handleIconClick(event: MouseEvent<SVGSVGElement>) {
    if (onIconClick) onIconClick()
  }

  return (
    <div className="input-button__box flex items-center">
      <div
        className={twMerge(
          `input-button__container flex items-center`,
          isActive() ? 'active' : '',
        )}
      >
        {(loading === undefined || !loading) && (
          <FontAwesomeIcon
            icon={icon ?? faSearch}
            className="icon"
            onClick={handleIconClick}
          />
        )}
        {loading !== undefined && loading && (
          <Spinner className="icon h-4! w-4!" />
        )}
        <input
          {...otherProps}
          type="search"
          id="input-button"
          onChange={(e) => {
            setValue(e.currentTarget.value)
            if (otherProps.onChange) otherProps.onChange(e)
          }}
        />
      </div>
    </div>
  )
})

export default InputButton
