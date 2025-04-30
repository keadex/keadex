'use client'

import dynamic from 'next/dynamic'

import '@keadex/mina-live/index.css'
const MinaLive = dynamic(() => import('@keadex/mina-live'), {
  ssr: false,
})

export default function MinaLiveClient() {
  return <MinaLive />
}
