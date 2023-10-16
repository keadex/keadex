import { getDataAttributes } from '@keadex/keadex-utils'
import React, { useEffect } from 'react'
import { Select as SelectTE } from 'tw-elements'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  [key: `data-${string}`]: unknown
  key?: string
  label: string
  options: {
    value: string | number | readonly string[] | undefined
    label: string
  }[]
}

export const Select = React.memo((props: SelectProps) => {
  const { label, className, ...otherProps } = { ...props }

  const dataAttributes = getDataAttributes(props)

  function renderOptions(): JSX.Element[] {
    const renderedOptions: JSX.Element[] = []
    props.options.forEach((option) => {
      renderedOptions.push(
        <option value={option.value} key={option.value?.toString()}>
          {option.label}
        </option>
      )
    })
    return renderedOptions
  }

  useEffect(() => {
    const element = document.querySelector(`#${props.id}`)
    const selectInstance = SelectTE.getInstance(element)
    if (!selectInstance) {
      new SelectTE(
        document.querySelector(`#${props.id}`),
        {},
        {
          dropdown: 'select__dropdown',
          formCheckInput: 'bg-red-400 checked:after:border-red-500',
          selectInput: 'peer select__input',
          selectOption:
            'select__option data-[te-select-option-selected]:data-[te-input-state-active]:link',
          selectLabelSizeDefault: 'select__label-size-default',
          selectLabel: 'select__label',
          selectArrow: 'select__arrow top-[0.65rem]',
        }
      )
    }
  })

  return (
    <div className={`relative mb-3 ${className}`}>
      <select data-te-select-init {...otherProps} {...dataAttributes}>
        {renderOptions()}
      </select>
      <label data-te-select-label-ref>{label}</label>
    </div>
  )
})

export default Select
