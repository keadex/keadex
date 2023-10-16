import { useForceUpdate } from '@keadex/keadex-ui-kit/cross'
import { getDataAttributes } from '@keadex/keadex-utils'
import React, { useEffect, useState } from 'react'
import { Select as SelectTE } from 'tw-elements'

export type AutocompleteProps =
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    [key: `data-${string}`]: unknown
    key?: string
    label: string
    options: {
      value: string | number | readonly string[] | undefined
      label: string
    }[]
    initialValue?: string
    onTyping: (value: string) => void
  }

export const Autocomplete = React.memo((props: AutocompleteProps) => {
  const { label, className, onTyping, initialValue, ...otherProps } = {
    ...props,
  }

  const dataAttributes = getDataAttributes(props)
  const [localInputValue, setLocalInputValue] = useState(
    props.value?.toString() ?? ''
  )
  const { forceUpdate } = useForceUpdate()

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
          selectInput: `peer select__input`,
          selectOption:
            'select__option data-[te-select-option-selected]:data-[te-input-state-active]:link',
          selectLabelSizeDefault: 'select__label-size-default',
          selectLabel: 'select__label',
          selectArrow: 'select__arrow top-[0.65rem]',
        }
      )
    }
    const input = document.querySelector(
      `.${props.id} [data-te-select-input-ref]`
    )
    if (input) {
      const inputEl = input as HTMLInputElement
      inputEl.removeAttribute('readonly')
      inputEl.removeAttribute('role')
      inputEl.value = localInputValue
      inputEl.oninput = () => {
        setLocalInputValue(inputEl.value)
        props.onTyping(inputEl.value)
      }
    }
  })

  useEffect(() => {
    forceUpdate()
  }, [localInputValue])

  return (
    <div className={`${props.id} autocomplete relative mb-3 ${className}`}>
      <select
        data-te-select-init
        {...otherProps}
        {...dataAttributes}
        value={localInputValue}
      >
        {renderOptions()}
      </select>
      <label data-te-select-label-ref>{label}</label>
    </div>
  )
})

export default Autocomplete
