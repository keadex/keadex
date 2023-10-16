import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WindowProps {}

export const Window = React.memo(
  (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
      <div className="window__border bg-primary absolute left-0 right-0 top-0 bottom-0 overflow-hidden rounded drop-shadow-md">
        {props.children}
      </div>
    )
  }
)

export default Window
