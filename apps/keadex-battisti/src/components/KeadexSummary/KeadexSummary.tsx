'use client'

import Image from 'next/image'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import keadexLogoArchitecture from '../../../public/img/keadex-logo-architecture.svg'
import { useTranslation } from '../../app/i18n/client'

export type KeadexSummaryProps = {
  lang: string
}

export default function KeadexSummary({
  children,
  lang,
}: PropsWithChildren<KeadexSummaryProps>) {
  const { t } = useTranslation(lang)
  return (
    <div className="h-screen bg-dark-primary px-10 align-middle flex flex-col">
      <div className="text-xl md:text-2xl lg:text-3xl !leading-loose my-auto text-center font-extralight">
        <Image
          src={keadexLogoArchitecture}
          alt="Keadex Logo"
          className="mx-auto mb-10 lg:w-[36rem] w-[30rem]"
        />
        <Trans
          i18nKey="home.keadex_summary"
          t={t}
          components={{ span: <span /> }}
        />
      </div>
    </div>
  )
}
