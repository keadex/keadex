import { twMerge } from 'tailwind-merge'

export type RadioOption<T> = {
  label: string
  value: T
}
export interface RadioProps<T> {
  id: string
  className?: string
  options: RadioOption<T>[]
  onChange: (value: T) => void
  value?: T
  disabled?: boolean
}

export const Radio = <T,>(props: RadioProps<T>) => {
  const { className, options } = props

  return (
    <div
      className={twMerge(`flex justify-center`, className ?? '')}
      id={props.id ?? ''}
    >
      {options.map((option, index) => {
        return (
          <div
            className="mb-0.5 me-4 inline-block min-h-6 ps-6"
            key={`radioOption${index}`}
          >
            <input
              className={twMerge(
                `relative float-left -ms-6 me-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-third before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] after:absolute after:z-1 after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-accent-secondary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-2.5 checked:after:w-2.5 checked:after:rounded-full checked:after:border-accent-secondary checked:after:bg-accent-primary checked:after:content-[''] checked:after:transform-[translate(-50%,-50%)] hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:outline-hidden focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-accent-secondary checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] rtl:float-right`,
                props.disabled ? '' : 'hover:cursor-pointer',
              )}
              type="radio"
              name={`inlineRadioOptions-${props.id}`}
              id={`option-${props.id}-${index}`}
              value={JSON.stringify(option.value)}
              onChange={() => {
                props.onChange(option.value)
              }}
              checked={
                JSON.stringify(option.value) === JSON.stringify(props.value)
              }
              disabled={props.disabled}
            />
            <label
              className={twMerge(
                `mt-px inline-block ps-[0.15rem]`,
                props.disabled ? '' : 'hover:cursor-pointer',
              )}
              htmlFor={
                props.disabled ? undefined : `option-${props.id}-${index}`
              }
            >
              {option.label}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default Radio
