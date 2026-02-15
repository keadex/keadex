'use client'

import { Button } from '@keadex/keadex-ui-kit/components/cross/Button/Button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import bannerFeatures from '../../../public/img/mina/banner-features.svg'
import { useTranslation } from '../../app/i18n/client'
import ROUTES, { MINA_AI } from '../../core/routes'

export type MinaDetailsProps = {
  lang: string
}

export default function MinaDetails({
  children,
  lang,
}: PropsWithChildren<MinaDetailsProps>) {
  const { t } = useTranslation(lang)
  const router = useRouter()

  const features = [
    'keadex_mina.details.features.c4model',
    'keadex_mina.details.features.serverless',
    'keadex_mina.details.features.offline',
    'keadex_mina.details.features.simple',
  ]

  return (
    <div className="bg-dark-primary px-10 pb-28 align-middle flex flex-col">
      <span className="w-full mt-32 md:-mt-8 mb-32 md:mb-40 text-center left-0 text-2xl font-semibold">
        <Trans
          i18nKey="keadex_mina.slogan"
          t={t}
          components={{ span: <span /> }}
        />
      </span>
      <div className="w-full flex flex-col">
        <div className="text-3xl leading-10 font-extralight">
          <Trans
            i18nKey="keadex_mina.details.title"
            t={t}
            components={{ span: <span /> }}
          />
        </div>
        <div className="mt-5 pl-4 font-light">
          <ul className="list-disc">
            {features.map((feature) => {
              return (
                <li key={feature} className="mt-2">
                  <Trans
                    i18nKey={feature}
                    t={t}
                    components={{
                      span: <span />,
                      a: <a />,
                    }}
                  />
                </li>
              )
            })}
          </ul>
        </div>
        <Image
          src={bannerFeatures}
          alt="Banner with Mina features"
          className="mx-auto mt-16"
        />
      </div>
      <div className="text-center mt-16">
        <Button
          className="!text-sm"
          onClick={() => router.push(ROUTES[MINA_AI].path)}
        >
          {t('keadex_mina.details.explore_all_features')}
        </Button>
      </div>
    </div>
  )
}
