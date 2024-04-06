'use client'

import { faConfluence, faNpm } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@keadex/keadex-ui-kit/cross'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import Image from 'next/image'
import { useTranslation } from '../../app/i18n/client'
import docsIntegrationGif from '../../../public/img/mina/docs-integration.gif'

export type MinaDocsIntegrationProps = {
  lang: string
}

export default function MinaDocsIntegration({
  children,
  lang,
}: PropsWithChildren<MinaDocsIntegrationProps>) {
  const { t } = useTranslation(lang)

  return (
    <div className="bg-dark-primary px-10 py-28 align-middle">
      <div className="flex flex-col md:flex-row my-auto">
        <div className="w-full md:w-1/2 flex flex-col">
          <Image
            src={docsIntegrationGif}
            alt="Mina documentation integration example"
            className="w-full h-auto my-auto"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2 pl-0 md:pl-10 mt-10 md:my-auto">
          <div className="text-3xl leading-10 font-extralight">
            <Trans
              i18nKey="keadex_mina.docs_integration.title"
              t={t}
              components={{ span: <span /> }}
            />
          </div>
          <div className="mt-5 font-light">
            <Trans
              i18nKey="keadex_mina.docs_integration.description"
              t={t}
              components={{ span: <span />, ul: <ul />, li: <li /> }}
            />
            <div className="w-full flex flex-col md:flex-row gap-2 mt-5">
              <Button
                className="w-full !bg-red-800 hover:!bg-red-900 !text-[1rem] normal-case"
                onClick={() =>
                  window.open(
                    'https://www.npmjs.com/package/@keadex/mina-react',
                    '_blank',
                  )
                }
              >
                <FontAwesomeIcon icon={faNpm} className="mr-3" />
                <span>React</span>
              </Button>
              <Button
                className="w-full !bg-red-800 hover:!bg-red-900 !text-[1rem] normal-case"
                onClick={() =>
                  window.open(
                    'https://www.npmjs.com/package/@keadex/docusaurus-plugin-mina',
                    '_blank',
                  )
                }
              >
                <FontAwesomeIcon icon={faNpm} className="mr-3" />
                <span>Docusaurus</span>
              </Button>
              <Button
                className="w-full !bg-blue-600 hover:!bg-blue-700 !text-[1rem] normal-case"
                onClick={() =>
                  window.open(
                    'https://marketplace.atlassian.com/apps/1233762',
                    '_blank',
                  )
                }
              >
                <FontAwesomeIcon icon={faConfluence} className="mr-3" />
                <span>Confluence</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
