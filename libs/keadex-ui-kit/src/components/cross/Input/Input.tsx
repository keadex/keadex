'use client'

import { getDataAttributes } from '@keadex/keadex-utils'
import type { InputHTMLAttributes } from 'react'
import { ChangeEvent, memo, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  [key: `data-${string}`]: unknown
  key?: string
  label: string
  info?: string
  allowedChars?: RegExp
  classNameRoot?: string
}

export const Input = memo((props: InputProps) => {
  const [value, setValue] = useState<
    string | number | readonly string[] | undefined
  >(props.value)

  const { label, info, allowedChars, classNameRoot, key, ...otherProps } = props

  const dataAttributes = getDataAttributes(props)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    if (props.allowedChars && e.currentTarget.value !== '') {
      if (!props.allowedChars.test(e.currentTarget.value)) {
        if (value) e.currentTarget.value = value.toString()
        return
      }
    }
    setValue(e.currentTarget.value)
    if (props.onChange) props.onChange(e)
  }

  return (
    <div className={twMerge(`relative mb-3`, classNameRoot ?? '')}>
      <input
        maxLength={200}
        key={key}
        {...otherProps}
        {...dataAttributes}
        onChange={handleOnChange}
        data-te-input-state-active
        className={twMerge(
          `peer transition-all duration-200 ease-linear placeholder:opacity-0 motion-reduce:transition-none`,
          props.className,
        )}
        placeholder={props.label}
      />
      <label
        htmlFor={props.id}
        className={twMerge(
          value !== undefined && value !== null && value !== ''
            ? 'input__label -translate-y-[1.1rem] scale-[0.9]'
            : '',
          `peer-focus:text-link peer-focus:input__label pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-top-left truncate pt-[0.37rem] leading-[1.6] drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-all duration-200 ease-out peer-focus:-translate-y-[1.1rem] peer-focus:scale-[0.9] motion-reduce:transition-none`,
        )}
      >
        {props.label}
      </label>
      {info && <div className="text-sm px-3 mt-1">{info}</div>}
    </div>
  )
})

export default Input
