'use client'

import {
  AccordionProps,
  type AccordionItem,
} from '@keadex/keadex-ui-kit/components/cross/Accordion/Accordion'
import dynamic from 'next/dynamic'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import { useTranslation } from '../../app/i18n/client'
import Image from 'next/image'
import blockedDownloadStep1 from '../../../public/img/mina/blocked-download-step-1.jpg'
import blockedDownloadStep2 from '../../../public/img/mina/blocked-download-step-2.jpg'
import blockedDownloadStep3 from '../../../public/img/mina/blocked-download-step-3.jpg'
import blockedSetupStep1Win from '../../../public/img/mina/blocked-setup-step-1-win.png'
import blockedSetupStep2Win from '../../../public/img/mina/blocked-setup-step-2-win.png'
import blockedSetupStep1MacOs from '../../../public/img/mina/blocked-setup-step-1-macos.png'
import blockedSetupStep2MacOs from '../../../public/img/mina/blocked-setup-step-2-macos.png'
import blockedSetupStep3MacOs from '../../../public/img/mina/blocked-setup-step-3-macos.png'
import blockedSetupStep4MacOs from '../../../public/img/mina/blocked-setup-step-4-macos.png'
import blockedSetupStep56MacOs from '../../../public/img/mina/blocked-setup-step-5-6-macos.png'
import blockedSetupStep7MacOs from '../../../public/img/mina/blocked-setup-step-7-macos.png'

const Accordion = dynamic<AccordionProps<null>>(
  () => import('@keadex/keadex-ui-kit/components/cross/Accordion/Accordion'),
  {
    ssr: false,
  },
)

export type MinaFAQProps = {
  lang: string
}

export default function MinaFAQ({
  children,
  lang,
}: PropsWithChildren<MinaFAQProps>) {
  const { t } = useTranslation(lang)

  const faqs: AccordionItem<null>[] = [
    {
      header: (
        <Trans i18nKey="keadex_mina.faq.question_download_blocked" t={t} />
      ),
      body: (
        <div className="flex flex-col">
          <div>
            <Trans
              i18nKey="keadex_mina.faq.answer_download_blocked"
              t={t}
              components={{ span: <span /> }}
            />
          </div>
          <div>
            <Trans
              i18nKey="keadex_mina.faq.reason_not_signed"
              t={t}
              components={{ span: <span />, a: <a /> }}
            />
          </div>
          <span className="mt-5 font-bold italic">E.g. Microsoft Edge</span>
          <div className="grid grid-flow-row md:grid-flow-col mt-2 w-full gap-5">
            <Image
              src={blockedDownloadStep1}
              className="w-full rounded-2xl"
              alt="Step 1 blocked download"
            />
            <Image
              src={blockedDownloadStep2}
              className="w-full rounded-2xl"
              alt="Step 2 blocked download"
            />
            <Image
              src={blockedDownloadStep3}
              className="w-full rounded-2xl"
              alt="Step 3 blocked download"
            />
          </div>
        </div>
      ),
    },
    {
      header: <Trans i18nKey="keadex_mina.faq.question_setup_blocked" t={t} />,
      body: (
        <div className="flex flex-col">
          <div>
            <Trans
              i18nKey="keadex_mina.faq.answer_setup_blocked"
              t={t}
              components={{ span: <span /> }}
            />
          </div>
          <div>
            <Trans
              i18nKey="keadex_mina.faq.reason_not_signed"
              t={t}
              components={{ span: <span />, a: <a /> }}
            />
          </div>
          <span className="mt-5 font-bold italic">Microsoft Windows:</span>
          <div className="w-full my-5 text-center">
            <Image
              src={blockedSetupStep1Win}
              className="w-full md:w-96 mr-5 rounded-2xl inline"
              alt="Step 1 blocked setup Windows"
            />
            <Image
              src={blockedSetupStep2Win}
              className="w-full md:w-96 rounded-2xl inline mt-5 md:mt-0"
              alt="Step 2 blocked setup Windows"
            />
          </div>
          <span className="mt-5 font-bold italic">Apple macOS:</span>
          <div className="grid grid-flow-row md:grid-flow-col mt-2 w-full gap-5">
            <Image
              src={blockedSetupStep1MacOs}
              className="w-full mx-auto my-auto rounded-2xl"
              alt="Step 1 blocked setup macOS"
            />
            <Image
              src={blockedSetupStep2MacOs}
              className="w-full mx-auto my-auto rounded-2xl"
              alt="Step 2 blocked setup macOS"
            />
            <Image
              src={blockedSetupStep3MacOs}
              className="w-full mx-auto my-auto rounded-2xl"
              alt="Step 3 blocked setup macOS"
            />
            <Image
              src={blockedSetupStep4MacOs}
              className="w-full mx-auto my-auto rounded-2xl"
              alt="Step 4 blocked setup macOS"
            />
          </div>
          <div className="w-full mt-5 text-center">
            {/* <Image
              src={blockedSetupStep4MacOs}
              className="w-full mx-auto my-auto rounded-2xl"
              alt="Step 4 blocked setup macOS"
            /> */}
            <Image
              src={blockedSetupStep56MacOs}
              className="w-full md:w-[28rem] mr-5 rounded-2xl inline"
              alt="Step 5 & 6 blocked setup macOS"
            />
            <Image
              src={blockedSetupStep7MacOs}
              className="w-full md:w-48 mt-5 md:mt-0 rounded-2xl inline"
              alt="Step 7 blocked setup macOS"
            />
          </div>
        </div>
      ),
    },
  ]
  return (
    <div className="bg-dark-primary px-10 py-28 align-middle">
      <div className="flex flex-col my-auto">
        <div className="text-3xl leading-10 font-extralight text-center w-full mb-5">
          <Trans i18nKey="common.faq" t={t} components={{ span: <span /> }} />
        </div>
        <Accordion id="mina-faq" items={faqs} buttonIconPosition="left" />
      </div>
    </div>
  )
}
