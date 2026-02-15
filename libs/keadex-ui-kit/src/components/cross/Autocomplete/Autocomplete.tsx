'use client'

import { getDataAttributes } from '@keadex/keadex-utils'
import type { JSX, SelectHTMLAttributes } from 'react'
import { memo, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Select as SelectTE } from 'tw-elements'

import { useForceUpdate } from '../../../cross'

export type AutocompleteOption = {
  value: string | number | readonly string[] | undefined
  label: string
}

export type AutocompleteProps = SelectHTMLAttributes<HTMLSelectElement> & {
  [key: `data-${string}`]: unknown
  key?: string
  label: string
  options: AutocompleteOption[]
  initialValue?: string
  allowedChars?: RegExp
  info?: string
  onTyping: (value: string) => void
  onDefaultOptionSelected?: (value: string) => void
}

export const Autocomplete = memo((props: AutocompleteProps) => {
  const {
    label,
    className,
    onTyping,
    initialValue,
    onDefaultOptionSelected,
    allowedChars,
    info,
    key,
    ...otherProps
  } = props

  const dataAttributes = getDataAttributes(props)
  const [localInputValue, setLocalInputValue] = useState(
    props.value?.toString() ?? '',
  )
  const { forceUpdate } = useForceUpdate()

  function renderOptions(): JSX.Element[] {
    const renderedOptions: JSX.Element[] = []
    props.options.forEach((option, index) => {
      renderedOptions.push(
        <option
          value={option.value}
          key={`${option.value?.toString()}_${index}`}
        >
          {option.label}
        </option>,
      )
    })
    return renderedOptions
  }

  function getDefaultOptionElement() {
    const options = document.querySelectorAll(
      `.${props.id}[data-te-select-option-ref]`,
    )
    if (options && options.length > 0) return options[0] as HTMLDivElement
    return
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
          selectOption: `select__option ${props.id} data-[te-select-option-selected]:data-[te-input-state-active]:link`,
          selectLabelSizeDefault: 'select__label-size-default',
          selectLabel: 'select__label',
          selectArrow: 'select__arrow top-[0.65rem]',
        },
      )
    }

    const inputEl = document.querySelector(
      `.${props.id} [data-te-select-input-ref]`,
    ) as HTMLInputElement | undefined

    if (inputEl) {
      inputEl.removeAttribute('readonly')
      inputEl.removeAttribute('role')
      // inputEl.value = localInputValue
      inputEl.oninput = () => {
        if (props.allowedChars && inputEl.value !== '') {
          if (!props.allowedChars.test(inputEl.value)) {
            if (localInputValue) inputEl.value = localInputValue
            return
          }
        }
        setLocalInputValue(inputEl.value)
        props.onTyping(inputEl.value)
      }
      if (onDefaultOptionSelected) {
        inputEl.onkeydown = (e) => {
          if (e.key === 'Enter') {
            const defaultOptionEl = getDefaultOptionElement()
            if (
              defaultOptionEl &&
              defaultOptionEl.hasAttribute('data-te-input-state-active')
            ) {
              onDefaultOptionSelected(localInputValue)
            }
          }
        }
      }
    }
    if (onDefaultOptionSelected) {
      const defaultOptionEl = getDefaultOptionElement()
      if (defaultOptionEl) {
        defaultOptionEl.onclick = () => onDefaultOptionSelected(localInputValue)
      }
    }
  })

  useEffect(() => {
    forceUpdate()
  }, [localInputValue])

  return (
    <div className={twMerge(props.id, `autocomplete relative mb-3`, className)}>
      <select
        data-te-select-init
        key={key}
        {...otherProps}
        {...dataAttributes}
        value={localInputValue}
      >
        {renderOptions()}
      </select>
      <label data-te-select-label-ref>{label}</label>
      {info && <div className="text-sm px-3">{info}</div>}
    </div>
  )
})

export default Autocomplete
