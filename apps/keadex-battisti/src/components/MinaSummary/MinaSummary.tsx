'use client'

import Image from 'next/image'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import minaLogo from '../../../public/img/keadex-mina-logo-color.svg'
import { useTranslation } from '../../app/i18n/client'
import { Button } from '@keadex/keadex-ui-kit/cross'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDesktop } from '@fortawesome/free-solid-svg-icons'
import { faConfluence, faNpm } from '@fortawesome/free-brands-svg-icons'

export type MinaSummaryProps = {
  lang: string
}

export default function MinaSummary({
  children,
  lang,
}: PropsWithChildren<MinaSummaryProps>) {
  const { t } = useTranslation(lang)
  const [latestMinaVersion, setLatestMinaVersion] = useState('')

  async function getLatestMinaVersion() {
    setLatestMinaVersion(
      JSON.parse(
        await (
          await fetch(
            'https://gist.githubusercontent.com/keadex/7f3ebbc2691dc83591c96a6662f37e94/raw/keadex-mina-latest.json',
          )
        ).text(),
      ).version,
    )
  }

  async function download(direct: boolean) {
    let url

    if (direct) {
      const part1URL =
        'https://github.com/keadex/keadex/releases/download/keadex-mina-v'
      const part2URL = '/Keadex.Mina_'
      const baseURL = `${part1URL}${latestMinaVersion}${part2URL}${latestMinaVersion}`

      const windows64 = `${baseURL}_x64-setup.exe`
      const macOS = `${baseURL}_x64.dmg`
      const linux64 = `${baseURL}_amd64.AppImage`

      url = windows64 // default windows x64

      const userAgent = navigator?.userAgent.toLowerCase()

      // You can add more checks for specific OS if needed
      if (userAgent.includes('win')) {
        url = windows64
      } else if (userAgent.includes('mac')) {
        url = macOS
      } else if (userAgent.includes('linux')) {
        url = linux64
      }
    } else {
      url = `https://github.com/keadex/keadex/releases/tag/keadex-mina-v${latestMinaVersion}`
    }

    window.open(url, '_blank')
  }

  useEffect(() => {
    getLatestMinaVersion()
  }, [])

  return (
    <div className="h-auto md:h-screen bg-dark-primary px-10 pt-28 md:pt-0 align-middle flex flex-col">
      <div className="flex flex-col my-auto">
        <div className="flex flex-row mb-12 md:mb-16 mx-auto md:mx-0">
          <Image
            src={minaLogo}
            alt="Keadex Mina Logo"
            className="w-[15rem] md:w-[22rem]"
          />
          <div className="ml-2 md:ml-5 bg-dark-brand1 rounded-md py-1 px-1 md:px-5 text-xs md:text-xl my-auto">
            BETA
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col w-full pr-0 md:pr-5 md:w-1/2 ">
            <div className="text-4xl md:text-5xl leading-10 md:leading-[4rem] mb-8">
              <Trans
                i18nKey="keadex_mina.title"
                t={t}
                components={{ span: <span /> }}
              />
            </div>
            <div className="text-2xl leading-10 mb-12">
              <Trans
                i18nKey="keadex_mina.description"
                t={t}
                components={{ span: <span /> }}
              />
            </div>
            <Button
              className="!text-lg w-fit mb-2"
              onClick={() => download(true)}
            >
              <FontAwesomeIcon icon={faDesktop} className="mr-3" />
              <span>Download </span>
              <span className="text-xs">v{latestMinaVersion}</span>
            </Button>
            <a
              onClick={() => download(false)}
              href="#"
              className="no-underline hover:underline w-fit"
            >
              <Trans i18nKey="keadex_mina.other_download_options" t={t} />
            </a>
            <span className="font-light mt-5 mb-2">
              <Trans i18nKey="common.packages" t={t} />:
            </span>
            <div className="w-full flex flex-col md:flex-row gap-2">
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
          <iframe
            src="https://www.youtube.com/embed/Cy6KzhWjNLo"
            className="w-full mt-10 md:w-1/2 md:mt-0 h-80 border-0"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      </div>
    </div>
  )
}
