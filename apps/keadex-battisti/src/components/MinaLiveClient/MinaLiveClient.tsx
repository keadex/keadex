'use client'

import dynamic from 'next/dynamic'
import '@keadex/mina-live-npm/index.css'

const MinaLive = dynamic(() => import('@keadex/mina-live-npm'), {
  ssr: false,
})

// eslint-disable-next-line @typescript-eslint/ban-types
export type MinaLiveClientProps = {}

export default function MinaLiveClient() {
  return <MinaLive />
}
