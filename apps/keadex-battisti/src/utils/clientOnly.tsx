'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

export function clientOnly<T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
) {
  return dynamic(importer, { ssr: false }) as T
}
