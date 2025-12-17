'use client'

import { clientOnly } from '../utils/clientOnly'

export const MinaReactClient = clientOnly(
  () => import('@keadex/mina-react-npm'),
)

export const PlayerClient = clientOnly(
  () => import('@keadex/keadex-ui-kit/components/cross/Player/Player'),
)
