'use client'

import Image from 'next/image'
import { PropsWithChildren } from 'react'
import projectLifecycle from '../../../public/img/project-lifecycle.svg'
import keadexMinaLogo from '../../../public/img/keadex-mina-logo.svg'
import { Trans } from 'react-i18next'
import { useTranslation } from '../../app/i18n/client'
import ROUTES, { PROJECT_KEADEX_MINA } from '../../core/routes'
import Link from 'next/link'
import { AnimationOnScroll } from 'react-animation-on-scroll'

export type ProjectsSummaryProps = {
  lang: string
}

export default function ProjectsSummary({
  children,
  lang,
}: PropsWithChildren<ProjectsSummaryProps>) {
  const { t } = useTranslation(lang)

  return (
    <div className="min-h-screen px-10 py-20 align-middle flex flex-col bg-primary">
      <div className="text-xl md:text-xl lg:text-xl !leading-loose my-auto font-extralight">
        <div className="text-4xl font-bold pb-14 text-center">
          <h1>{t('common.projects')}</h1>
        </div>
        <div className="flex flex-col lg:flex-row text-center">
          <div className="pr-0 lg:pr-10 pb-10 lg:pb-0 my-auto">
            <Image
              src={projectLifecycle}
              alt="Project lifecycle"
              className="w-[60rem]"
            />
          </div>
          <div className="text-left">
            <Trans
              i18nKey="home.projects_summary"
              t={t}
              components={{ span: <span /> }}
            />
          </div>
        </div>
        <div className="text-center text-lg w-full pt-14 flex flex-col">
          <span className="font-normal">
            {t('common.action.select_project')}
          </span>
          <AnimationOnScroll animateIn="animate__bounceIn">
            <Link href={ROUTES[PROJECT_KEADEX_MINA].path}>
              <Image
                src={keadexMinaLogo}
                alt="Keadex Mina Logo"
                className="w-72 mx-auto mt-5"
              />
            </Link>
          </AnimationOnScroll>
        </div>
      </div>
    </div>
  )
}
