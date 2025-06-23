import React from 'react'
import { getDataAttributes } from '@keadex/keadex-utils'
import { PropsWithChildren } from 'react'
import Spinner from '../Spinner/Spinner'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  [key: `data-${string}`]: unknown
  key?: string
  value?: string | number | string[] | undefined
  defaultValue?: string | number | string[] | undefined
  isLoading?: boolean
}

export const Button = React.memo((props: PropsWithChildren<ButtonProps>) => {
  const dataAttributes = getDataAttributes(props)
  const { children, isLoading, disabled, ...otherProps } = props
  return (
    <button
      {...otherProps}
      {...dataAttributes}
      disabled={disabled || isLoading}
      type="button"
      data-te-toggle="button"
      className={`button--primary inline-block min-w-[75px] rounded px-5 py-2 text-xs font-medium uppercase leading-tight shadow-md transition duration-75 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg ${props.className}`}
    >
      {isLoading && <Spinner className="icon !h-4 !w-4" />}
      {!isLoading && children}
    </button>
  )
})

export default Button
