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
                    'https://developer.atlassian.com/console/install/592fbf5b-017b-4db1-b3db-3cdced81f381?signature=AYABeFOcO3X9UhuQ8LY1iwZOWQ4AAAADAAdhd3Mta21zAEthcm46YXdzOmttczp1cy1lYXN0LTE6NzA5NTg3ODM1MjQzOmtleS83ZjcxNzcxZC02OWM4LTRlOWItYWU5Ny05MzJkMmNhZjM0NDIAuAECAQB4KZa3ByJMxgsvFlMeMgRb2S0t8rnCLHGz2RGbmY8aB5YBhV%2F%2FRtSUdEqYNw%2FkYNVEogAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDOM%2B2dszhXcpPfdmDAIBEIA7vJ0tyajsNfTDJWZ0mKr2u4kglGh6JjJ%2FwmovyoYjCEDF7NZkZaAwBdAid%2FqYFiRlDSnOstV0jcH%2BQoYAB2F3cy1rbXMAS2Fybjphd3M6a21zOmV1LXdlc3QtMTo3MDk1ODc4MzUyNDM6a2V5LzU1OWQ0NTE2LWE3OTEtNDdkZi1iYmVkLTAyNjFlODY4ZWE1YwC4AQICAHhHSGfAZiYvvl%2F9LQQFkXnRjF1ris3bi0pNob1s2MiregHZQgH2ySEpmjnqXtqMROeVAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMA6nGuJYUSlWN8CMjAgEQgDulL96Lb2IL59NzI7EDhYt4mKj9kKo%2FdEu6%2BD4FR9sfYL04KneIdjE9R%2FEdTnfoIyj61ZBzN2O9%2BWwV3AAHYXdzLWttcwBLYXJuOmF3czprbXM6dXMtd2VzdC0yOjcwOTU4NzgzNTI0MzprZXkvM2M0YjQzMzctYTQzOS00ZmNhLWEwZDItNDcyYzE2ZWRhZmRjALgBAgIAePadDOCfSw%2BMRVmOIDQhHhGooaxQ%2FiwGaLB334n1X9RCAR%2BtR%2Bz%2FThkM8Dpe9PpdwykAAAB%2BMHwGCSqGSIb3DQEHBqBvMG0CAQAwaAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAwyQg9bT3kLp38NNg4CARCAO8Rr5ip54%2BmYNDzG9P%2BfV9OZ%2FcfnO4E2Gr2%2FxxWALiVI%2Bhc6lxl5OMkrqqyoUfbSHhSgyGeUKMAsDwtNAgAAAAAMAAAQAAAAAAAAAAAAAAAAAAxG8%2BgJCxgWwkCM68CO0Zf%2F%2F%2F%2F%2FAAAAAQAAAAAAAAAAAAAAAQAAADIOsM08zW6nuPOQaEWWJBHkkCcStRJnHona3N45vwZs%2FI%2FDeaTF58OSuVEcWIXAnq040F7%2BTQ2Di%2ByPMvoC1Hi9Z6Q%3D&product=confluence',
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
