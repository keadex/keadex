'use client'

import dynamic from 'next/dynamic'

import '@keadex/mina-live/index.css'
import { useEffect, useState } from 'react'

const MinaLive = dynamic(() => import('@keadex/mina-live'), {
  ssr: false,
})

export default function MinaLiveClient() {
  const [currentOrigin, setCurrentOrigin] = useState<null | string>()

  useEffect(() => {
    if (location) {
      // Access the current page URL using window.location
      setCurrentOrigin(location.origin)
    }
  }, [])
  if (currentOrigin) {
    return (
      <MinaLive
        scriptPath={`${currentOrigin}/_next/static/chunks/mina_live_worker_wasm.js`}
      />
    )
  } else {
    return <></>
  }
}
