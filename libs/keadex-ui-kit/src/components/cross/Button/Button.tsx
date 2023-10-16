import React from 'react'
import { getDataAttributes } from '@keadex/keadex-utils'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  [key: `data-${string}`]: unknown
  key?: string
  value?: string | number | string[] | undefined
  defaultValue?: string | number | string[] | undefined
}

export const Button = React.memo((props: ButtonProps) => {
  const dataAttributes = getDataAttributes(props)
  return (
    <button
      {...props}
      {...dataAttributes}
      type="button"
      data-te-toggle="button"
      className={`button--primary inline-block min-w-[75px] rounded px-5 py-2 text-xs font-medium uppercase leading-tight shadow-md transition duration-75 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg ${props.className}`}
    />
  )
})

export default Button
