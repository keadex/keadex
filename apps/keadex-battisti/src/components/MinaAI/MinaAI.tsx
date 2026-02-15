'use client'

import type { PlayerProps } from '@keadex/keadex-ui-kit/components/cross/Player/Player'
import dynamic from 'next/dynamic'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'

import { useTranslation } from '../../app/i18n/client'

const Player = dynamic<PlayerProps>(
  () => import('@keadex/keadex-ui-kit/components/cross/Player/Player'),
  { ssr: false },
)

export type MinaAIProps = {
  lang: string
}

export default function MinaAI({
  children,
  lang,
}: PropsWithChildren<MinaAIProps>) {
  const { t } = useTranslation(lang)

  return (
    <div className="px-10 py-28 align-middle">
      <div className="flex flex-col md:flex-row my-auto">
        <div className="w-full md:w-1/2 flex flex-col my-auto">
          <div className="flex flex-row">
            <div className="text-3xl leading-10 font-extralight">
              <Trans
                i18nKey="keadex_mina.ai.title"
                t={t}
                components={{ span: <span /> }}
              />
            </div>
          </div>
          <div className="mt-5 font-light">
            <Trans
              i18nKey="keadex_mina.ai.description"
              t={t}
              components={{
                span: <span />,
                code: <code />,
                a: <a />,
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full md:w-1/2 pl-0 md:pl-10 mt-10 md:mt-0">
          <div className="my-auto">
            <Player
              src="https://player.vimeo.com/video/1071229228"
              playing
              muted
              loop
              width="100%"
              height="auto"
              style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
              config={{
                vimeo: {
                  responsive: true,
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
