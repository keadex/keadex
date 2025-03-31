'use client'

import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import { useTranslation } from '../../app/i18n/client'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

export type MinaProjectStructureProps = {
  lang: string
}

export default function MinaProjectStructure({
  children,
  lang,
}: PropsWithChildren<MinaProjectStructureProps>) {
  const { t } = useTranslation(lang)

  return (
    <div className="px-10 py-28 align-middle">
      <div className="flex flex-col md:flex-row my-auto">
        <div className="w-full md:w-1/2 flex flex-col my-auto">
          <div className="text-3xl leading-10 font-extralight">
            <Trans
              i18nKey="keadex_mina.project_structure.title"
              t={t}
              components={{ span: <span /> }}
            />
          </div>
          <div className="mt-5 font-light">
            <Trans
              i18nKey="keadex_mina.project_structure.description"
              t={t}
              components={{
                span: <span />,
                ul: <ul />,
                li: <li />,
                code: <code />,
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full md:w-1/2 pl-0 md:pl-10 mt-10 md:mt-0">
          <div className="my-auto">
            <ReactPlayer
              url="https://vimeo.com/1070152500/8b11627a96"
              playing
              muted
              loop
              width="100%"
              height="100%"
              config={{
                vimeo: {
                  playerOptions: {
                    responsive: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
