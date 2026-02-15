'use client'

import { Button } from '@keadex/keadex-ui-kit/components/cross/Button/Button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { AnimationOnScroll } from 'react-animation-on-scroll'
import { Trans } from 'react-i18next'
import architectural from '../../../public/img/architectural.svg'
import functionalLogo from '../../../public/img/functional.svg'
import operationalLogo from '../../../public/img/operational.svg'
import technicalLogo from '../../../public/img/technical.svg'
import { useTranslation } from '../../app/i18n/client'
import ROUTES, { DOCS_OVERVIEW } from '../../core/routes'

export type DocsSummaryProps = {
  lang: string
}

export default function DocsSummary({
  children,
  lang,
}: PropsWithChildren<DocsSummaryProps>) {
  const { t } = useTranslation(lang)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-dark-primary px-10 py-20 align-middle flex flex-col">
      <div className="text-xl md:text-xl lg:text-xl !leading-loose my-auto font-extralight">
        <h1 className="text-4xl font-bold pb-14 text-center">
          <span>{t('common.documentation')}</span>
        </h1>
        <div className="flex flex-col lg:flex-row text-center">
          <div className="w-full text-left">
            <Trans
              i18nKey="home.docs_summary_part1"
              t={t}
              components={{ span: <span /> }}
            />
            <div className="text-center">
              <AnimationOnScroll
                animateIn="animate__zoomIn"
                duration={0.35}
                className="inline-flex p-5 mr-0 md:mr-5 mt-5 bg-primary rounded-lg rounded-bl-lg flex-col w-full md:w-56 h-[27rem]"
              >
                <Image
                  src={operationalLogo}
                  alt="Operational docs logo"
                  className="w-28 h-28 mx-auto mt-12 md:mt-0"
                />
                <span className="text-2xl text-brand1 mt-3">
                  {t('common.operational')}
                </span>
                <span className="text-lg my-auto">
                  {t('home.operational_docs_descr')}
                </span>
              </AnimationOnScroll>
              <AnimationOnScroll
                animateIn="animate__zoomIn"
                duration={0.35}
                className="inline-flex p-5 mr-0 md:mr-5 mt-5 flex-col w-full md:w-56 bg-primary rounded-lg h-[27rem]"
              >
                <Image
                  src={functionalLogo}
                  alt="Functional docs logo"
                  className="w-28 h-28 mx-auto mt-12 md:mt-0"
                />
                <span className="text-2xl text-brand1 mt-3">
                  {t('common.functional')}
                </span>
                <span className="text-lg my-auto">
                  {t('home.functional_docs_descr')}
                </span>
              </AnimationOnScroll>
              <AnimationOnScroll
                animateIn="animate__zoomIn"
                duration={0.35}
                className="inline-flex p-5 mr-0 md:mr-5 mt-5 flex-col w-full md:w-56 bg-primary rounded-lg h-[27rem]"
              >
                <Image
                  src={architectural}
                  alt="Architectural docs logo"
                  className="w-28 h-28 mx-auto mt-12 md:mt-0"
                />
                <span className="text-2xl text-brand1 mt-3">
                  {t('common.architectural')}
                </span>
                <span className="text-lg my-auto">
                  {t('home.architectural_docs_descr')}
                </span>
              </AnimationOnScroll>
              <AnimationOnScroll
                animateIn="animate__zoomIn"
                duration={0.35}
                className="inline-flex p-5 mt-5 flex-col w-full md:w-56 bg-primary rounded-tr-lg rounded-lg h-[27rem]"
              >
                <Image
                  src={technicalLogo}
                  alt="Technical docs logo"
                  className="w-28 h-28 mx-auto mt-12 md:mt-0"
                />
                <span className="text-2xl text-brand1 mt-3">
                  {t('common.technical')}
                </span>
                <span className="text-lg my-auto">
                  {t('home.technical_docs_descr')}
                </span>
              </AnimationOnScroll>
            </div>
            <Trans
              i18nKey="home.docs_summary_part2"
              t={t}
              components={{ span: <span />, a: <a /> }}
            />
          </div>
        </div>
        <div className="text-center text-lg w-full mt-10 flex flex-col">
          <Button
            onClick={() => router.push(ROUTES[DOCS_OVERVIEW].path)}
            className="w-60 mx-auto"
          >
            {t('home.check_docs')}
          </Button>
        </div>
      </div>
    </div>
  )
}
