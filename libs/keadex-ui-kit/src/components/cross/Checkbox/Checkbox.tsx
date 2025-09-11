import React from 'react'
import { capitalCase } from 'change-case'

export type CheckboxOption = {
  id: string
  label: string
  value: boolean
}
export interface CheckboxProps {
  id: string
  className?: string
  options: CheckboxOption[]
  onChange: (id: string, value: boolean) => void
  values?: Record<string, boolean>
  disabled?: boolean
}

export const Checkbox = (props: CheckboxProps) => {
  const { id, className, options, disabled, values, onChange } = props

  return (
    <div className={`flex justify-center ${className ?? ''}`} id={id}>
      {options.map((option, index) => {
        return (
          <div
            className={`flex ${index > 0 ? 'ml-5' : ''}`}
            key={`checkboxOption${id}_${index}`}
          >
            <input
              className={`!p-0 !mr-3 relative float-left me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent ${
                disabled ? '' : 'hover:cursor-pointer'
              }`}
              type="checkbox"
              name={`checkboxOption${id}_${index}`}
              id={option.id}
              value={values && JSON.stringify(values[option.id])}
              onChange={() => {
                onChange(option.id, values ? !values[option.id] : false)
              }}
              checked={values && values[option.id] === option.value}
              disabled={disabled}
            />
            <label
              htmlFor={disabled ? undefined : option.id}
              className={`${disabled ? '' : 'hover:cursor-pointer'}`}
            >
              {capitalCase(option.label)}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default Checkbox
