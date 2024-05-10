import React from 'react'
import { useDisableBrowserShortcuts } from '../../../hooks/useDisableBrowserShortcuts/useDisableBrowserShortcuts'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WindowProps {}

export const Window = React.memo(
  (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    useDisableBrowserShortcuts()

    return (
      <div className="window__border bg-primary absolute left-0 right-0 top-0 bottom-0 overflow-hidden rounded">
        {props.children}
      </div>
    )
  },
)

export default Window
