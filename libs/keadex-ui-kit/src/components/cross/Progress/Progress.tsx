import { memo } from 'react';
import { twMerge } from 'tailwind-merge'

export interface ProgressProps {
  width: string
  label: string
  className?: string
}

export const Progress = memo(
  ({ width, label, className }: ProgressProps) => {
    return (
      <div
        className={twMerge(`w-full h-4 bg-secondary relative`, className ?? '')}
      >
        <div className="absolute w-full text-center text-xs font-light leading-none text-white top-1/2 -translate-y-1/2 text-ellipsis overflow-hidden whitespace-nowrap py-1 px-1">
          {label}
        </div>
        <div
          className={twMerge(`bg-brand1 p-0.5 h-full`, className ?? '')}
          style={{ width }}
        />
      </div>
    )
  },
)

export default Progress
