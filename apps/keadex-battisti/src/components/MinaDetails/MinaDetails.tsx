'use client'

import { Tab, Tabs } from '@keadex/keadex-ui-kit/cross'
import Image from 'next/image'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import exportFeature from '../../../public/img/mina/mina-export.jpg'
import organize from '../../../public/img/mina/mina-organize.jpg'
import { useTranslation } from '../../app/i18n/client'

export type MinaDetailsProps = {
  lang: string
}

export default function MinaDetails({
  children,
  lang,
}: PropsWithChildren<MinaDetailsProps>) {
  const { t } = useTranslation(lang)

  const tabFeatures = [
    {
      i18nKey: 'organize',
      image: organize,
      alt: "Screenshot of Keadex Mina's organize feature",
    },
    {
      i18nKey: 'reuse',
      video: 'https://www.youtube.com/embed/pfYGNEbJ9Kg',
    },
    { i18nKey: 'link', video: 'https://www.youtube.com/embed/z4oOFNrtzfU' },
    { i18nKey: 'search', video: 'https://www.youtube.com/embed/oCje5uU8SXQ' },
    {
      i18nKey: 'export',
      image: exportFeature,
      alt: "Screenshot of Keadex Mina's export feature",
    },
  ]
  const tabs: Tab[] = tabFeatures.map((tabFeature) => {
    return {
      id: tabFeature.i18nKey,
      title: t(`common.${tabFeature.i18nKey}`),
      body: (
        <div className="flex flex-col">
          <div>
            <Trans
              i18nKey={`keadex_mina.details.features.${tabFeature.i18nKey}`}
              t={t}
              components={{ span: <span /> }}
            />
          </div>
          {tabFeature.image && (
            <Image
              className="w-full"
              alt={tabFeature.alt}
              src={tabFeature.image}
            />
          )}
          {tabFeature.video && (
            <iframe
              src={tabFeature.video}
              className="w-full h-80 border-0"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          )}
        </div>
      ),
    }
  })

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
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col h-fit w-full md:w-1/2">
          <Tabs tabs={tabs} tabClassName="!m-0" bodyClassName="px-0 pt-0" />
        </div>
        <div className="w-full mt-10 md:w-1/2 md:mt-0 pl-0 md:pl-10 flex flex-col">
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
        </div>
      </div>
    </div>
  )
}
