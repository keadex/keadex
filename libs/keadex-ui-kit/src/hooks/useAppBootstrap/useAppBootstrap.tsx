'use client'

import { useEffect, useState } from 'react'
import { addGoogleAnalytics } from '../../core/google-analytics'

export type AppBootstrapProps = {
  initGA?: boolean
  initTE?: () => Promise<void>
}

export function useAppBootstrap(props: AppBootstrapProps) {
  const { initTE, initGA } = props
  const [isGAInitialized, setIsGAInitialized] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      if (initTE) {
        await initTE()
      }
      if (initGA) {
        addGoogleAnalytics(isGAInitialized, setIsGAInitialized)
      }
    })()
  }, [isGAInitialized, initGA, initTE])

  return {
    isGAInitialized,
  }
}
