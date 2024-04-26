import { getDataAttributes } from '@keadex/keadex-utils'
import React, { useEffect, useState } from 'react'

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    [key: `data-${string}`]: unknown
    key?: string
    label: string
  }

export const Textarea = React.memo((props: TextareaProps) => {
  const [value, setValue] = useState<
    string | number | readonly string[] | undefined
  >(props.value)
  const dataAttributes = getDataAttributes(props)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <div className={`relative mb-3`} data-te-input-wrapper-init>
      {/* The following div is a workaround for the bug of the tw-elements 
      Input script: tw-elements/src/js/forms/input.js
      Without this workaround, the Textarea component throws an error on focus/exit. */}
      <div
        data-te-input-notch-ref
        data-te-input-notch-leading-ref
        data-te-input-notch-middle-ref
        data-te-input-notch-trailing-ref
      />

      <textarea
        rows={3}
        {...props}
        {...dataAttributes}
        onChange={(e) => {
          setValue(e.currentTarget.value)
          if (props.onChange) props.onChange(e)
        }}
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
    </div>
  )
})

export default Textarea
