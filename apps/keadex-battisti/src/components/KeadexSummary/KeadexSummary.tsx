'use client'

import Image from 'next/image'
import { PropsWithChildren } from 'react'
import keadexLogoArchitecture from '../../../public/img/keadex-logo-architecture.svg'
import { useTranslation } from '../../app/i18n/client'
import Link from 'next/link'
import ROUTES, { PROJECT_KEADEX_MINA } from '../../core/routes'
import keadexMinaLogo from '../../../public/img/keadex-mina-logo.svg'

export type KeadexSummaryProps = { lang: string }

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
        <div className="text-center text-lg flex flex-col absolute left-0 right-0 bottom-12 justify-center items-center">
          <span className="font-extralight">
            {t('common.action.explore_os_projects')}
          </span>
          <Link href={ROUTES[PROJECT_KEADEX_MINA].path}>
            <Image
              src={keadexMinaLogo}
              alt="Keadex Mina Logo"
              className="w-50 mx-auto mt-8"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
