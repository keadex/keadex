import React from 'react'

export interface SeparatorProps {
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

export const Separator = React.memo((props: SeparatorProps) => {
  const { className } = props
  let { orientation } = props
  orientation = orientation ?? 'vertical'
  let style = 'h-auto w-px bg-gradient-to-t'
  if (orientation === 'horizontal') style = 'w-full h-px bg-gradient-to-r'
  return (
    <div
      className={`${style} self-stretch from-transparent via-neutral-50 to-transparent opacity-20 ${
        className ?? ''
      }`}
    ></div>
  )
})

export default Separator
