'use client'

import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import { useTranslation } from '../../app/i18n/client'
import Image from 'next/image'
import messyDiagram from '../../../public/img/mina/messy-diagram.jpg'
import clearDiagram from '../../../public/img/mina/clear-diagram.png'

export type MinaRenderingProps = {
  lang: string
}

export default function MinaRendering({
  children,
  lang,
}: PropsWithChildren<MinaRenderingProps>) {
  const { t } = useTranslation(lang)

  return (
    <div className="bg-dark-primary px-10 py-28 align-middle">
      <div className="flex flex-col md:flex-row my-auto">
        <div className="w-full md:w-1/2 flex flex-col my-auto">
          <span className="mt-5 md:mt-0 font-bold italic">
            <Trans i18nKey="keadex_mina.rendering.hybrid_layout" t={t} />
          </span>
          <Image
            src={clearDiagram}
            className="w-full h-auto lg:w-auto lg:h-52 mx-auto mt-5 rounded-md"
            alt="Example of clear diagram created with Mina"
          />
          <span className="mt-10 font-bold italic">
            <Trans i18nKey="keadex_mina.rendering.auto_layout" t={t} />
          </span>
          <Image
            src={messyDiagram}
            className="w-full h-auto lg:w-auto lg:h-80 mx-auto mt-5 rounded-md"
            alt="Example of messy diagram created with other tools"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2 pl-0 md:pl-10 mt-5 md:my-auto">
          <div className="text-3xl leading-10 font-extralight">
            <Trans
              i18nKey="keadex_mina.rendering.title"
              t={t}
              components={{ span: <span /> }}
            />
          </div>
          <div className="mt-5 font-light">
            <Trans
              i18nKey="keadex_mina.rendering.description"
              t={t}
              components={{ span: <span />, ul: <ul />, li: <li /> }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
