import { memo } from 'react';
import { twMerge } from 'tailwind-merge'

export interface SpinnerProps {
  className?: string
}

export const Spinner = memo((props: SpinnerProps) => {
  const { className } = props

  return (
    <div
      className={twMerge(
        `inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`,
        className,
      )}
      role="status"
    >
      <span className="absolute! -m-px! h-px! w-px! overflow-hidden! whitespace-nowrap! border-0! p-0! [clip:rect(0,0,0,0)]!">
        Loading...
      </span>
    </div>
  )
})

export default Spinner
