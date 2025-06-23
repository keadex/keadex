'use client'

import Image from 'next/image'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import minaPlantUML from '../../../public/img/mina/mina-plantuml.png'
import logoPlantUML from '../../../public/img/mina/logo-plantuml.png'
import { useTranslation } from '../../app/i18n/client'

export type MinaPlantUMLProps = {
  lang: string
}

export default function MinaPlantUML({
  children,
  lang,
}: PropsWithChildren<MinaPlantUMLProps>) {
  const { t } = useTranslation(lang)

  return (
    <div className="px-10 py-28 align-middle">
      <div className="flex flex-col md:flex-row my-auto">
        <div className="w-full md:w-1/2 flex flex-col my-auto">
          <div className="text-3xl leading-10 font-extralight">
            <Trans
              i18nKey="keadex_mina.plantuml.title"
              t={t}
              components={{ span: <span /> }}
            />
          </div>
          <div className="mt-5 font-light">
            <Trans
              i18nKey="keadex_mina.plantuml.description"
              t={t}
              components={{ span: <span />, a: <a /> }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full md:w-1/2 pl-0 md:pl-10 mt-5 md:mt-0">
          <Image
            src={logoPlantUML}
            className="h-20 w-auto mb-5 mx-auto my-auto"
            alt="Logo PlantUML"
          />
          <Image
            src={minaPlantUML}
            className="w-full mx-auto my-auto"
            alt="Mina PlantUML example"
          />
        </div>
      </div>
    </div>
  )
}
