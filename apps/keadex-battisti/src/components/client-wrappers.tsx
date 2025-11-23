'use client'

import { clientOnly } from '../utils/clientOnly'

export const MinaReactClient = clientOnly(
  () => import('@keadex/mina-react-npm'),
)

export const ReactPlayerClient = clientOnly(() => import('react-player'))
