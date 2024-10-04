'use client'

import { Button, Tab, Tabs } from '@keadex/keadex-ui-kit/cross'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import hooksHLD from '../../../public/img/docs/mina/hooks-hld.png'
import exportFeature from '../../../public/img/mina/mina-export.jpg'
import minaIntellisense from '../../../public/img/mina/mina-intellisense.gif'
import organize from '../../../public/img/mina/mina-organize.jpg'
import minaTags from '../../../public/img/mina/mina-tags.png'
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
    {
      i18nKey: 'low-coding',
      video: 'https://www.youtube.com/embed/299HoVK1Y7Y',
    },
    {
      i18nKey: 'hooks',
      image: hooksHLD,
      alt: 'High Level Design of Mina Hooks',
    },
    {
      i18nKey: 'intellisense',
      image: minaIntellisense,
      alt: 'Animated gif showing how the C4 PlantUML IntelliSense works in the Mina code editor',
    },
    {
      i18nKey: 'tags',
      image: minaTags,
      alt: 'Screenshots of Keadex Mina tags feature',
    },
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
              components={{ span: <span />, a: <a /> }}
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
        <div className="w-full md:w-1/2 flex flex-col">
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

        <div className="mt-10 md:my-0 pl-0 md:pl-10 flex flex-col h-fit w-full md:w-1/2">
          <Tabs
            tabs={tabs}
            className="mina-details__tabs"
            tabClassName="!m-0"
            bodyClassName="px-0 pt-0"
          />
        </div>
      </div>
      <div className="text-center mt-12">
        <Button
          className="!text-sm"
          onClick={() => router.push(ROUTES[MINA_AI].path)}
        >
          {t('keadex_mina.details.view_all_features')}
        </Button>
      </div>
    </div>
  )
}
