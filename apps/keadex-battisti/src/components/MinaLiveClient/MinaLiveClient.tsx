'use client'

import { PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'

// const MinaLive = dynamic(() => import('@keadex/mina-live/MinaLive'), {
//   ssr: false,
// })

// eslint-disable-next-line @typescript-eslint/ban-types
export type MinaLiveClientProps = {}

export default function MinaLiveClient({
  children,
}: PropsWithChildren<MinaLiveClientProps>) {
  // return <MinaLive />
  return <div></div>
}
