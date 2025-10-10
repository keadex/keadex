'use client'

import { KEADEX_GH_CHANNEL_NAME } from '@keadex/keadex-utils/api'
import { useEffect, useState } from 'react'

export type GhAuthenticatedWebhookProps = {
  token: string
}

export default function GhAuthenticatedWebhook({
  token,
}: GhAuthenticatedWebhookProps) {
  const [bc, setBc] = useState<BroadcastChannel | null>(null)

  useEffect(() => {
    setBc(new BroadcastChannel(KEADEX_GH_CHANNEL_NAME))
  }, [])

  useEffect(() => {
    if (bc) {
      bc.postMessage({ token })
      window.close()
    }
  }, [bc, token])

  return <div className="p-10">Authenticated</div>
}
