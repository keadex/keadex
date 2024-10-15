'use client'

import { App } from '@keadex/keadex-mina/src/App'
import { useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
export type MinaLiveProps = {}

export const MinaLive = (props: MinaLiveProps) => {
  useEffect(() => {
    console.log(process.env.VITE_AI_ENABLED)
  })

  return (
    <div className="h-full w-full border-t flex items-center">
      <App />
    </div>
  )
}

export default MinaLive
