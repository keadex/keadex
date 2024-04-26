import { getDataAttributes } from '@keadex/keadex-utils'
import React, { ChangeEvent, useEffect, useState } from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  [key: `data-${string}`]: unknown
  key?: string
  label: string
  info?: string
  allowedChars?: RegExp
}

export const Input = React.memo((props: InputProps) => {
  const [value, setValue] = useState<
    string | number | readonly string[] | undefined
  >(props.value)

  const { label, info, allowedChars, ...otherProps } = {
    ...props,
  }

  const dataAttributes = getDataAttributes(props)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  function handleOnKeyDown(e: KeyboardEvent) {
    if (props.allowedChars) {
      if (!props.allowedChars.test(e.key)) e.preventDefault()
      // console.log(e.key)
    }
  }

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
    <div className={`relative mb-3`}>
      <input
        maxLength={200}
        {...otherProps}
        {...dataAttributes}
        onChange={handleOnChange}
        data-te-input-state-active
        className={`peer transition-all duration-200 ease-linear placeholder:opacity-0 motion-reduce:transition-none ${props.className}`}
        placeholder={props.label}
      />
      <label
        htmlFor={props.id}
        className={`${
          value && value !== ''
            ? 'input__label -translate-y-[1.1rem] scale-[0.9]'
            : ''
        } peer-focus:text-link peer-focus:input__label pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-all duration-200 ease-out peer-focus:-translate-y-[1.1rem] peer-focus:scale-[0.9] motion-reduce:transition-none`}
      >
        {props.label}
      </label>
      {info && <div className="text-sm px-3">{info}</div>}
    </div>
  )
})

export default Input
