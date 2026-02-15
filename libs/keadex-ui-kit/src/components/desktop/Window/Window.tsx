import type { ButtonHTMLAttributes } from 'react'
import { memo } from 'react'

import { useDisableBrowserShortcuts } from '../../../hooks/useDisableBrowserShortcuts/useDisableBrowserShortcuts'

export const Window = memo((props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  useDisableBrowserShortcuts()

  return (
    <div className="window__border bg-primary absolute left-0 right-0 top-0 bottom-0 overflow-hidden rounded-sm">
      {props.children}
    </div>
  )
})

export default Window
