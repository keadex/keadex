'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'

import keadexLogo from '../../../public/img/keadex-logo.png'
import { useTranslation } from '../../app/i18n/client'
import ROUTES, { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from '../../core/routes'

export type FooterProps = {
  lang: string
}

export default function Footer({
  children,
  lang,
}: PropsWithChildren<FooterProps>) {
  const { t } = useTranslation(lang)
  return (
    <div className="flex flex-col text-center bg-dark-primary py-10 px-5">
      <div>
        <Image
          src={keadexLogo}
          alt="Keadex logo"
          className="h-5 w-auto mx-auto"
        />
      </div>
      <div className="mt-5">
        <Trans
          i18nKey="footer.title"
          t={t}
          components={{ a: <a /> }}
          values={{ year: new Date().getFullYear() }}
        />
      </div>
      <div className="mt-5 text-sm">
        <Link href={ROUTES[PRIVACY_POLICY].path} className="no-underline">
          {t('footer.privacy_policy')}
        </Link>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link href={ROUTES[TERMS_AND_CONDITIONS].path} className="no-underline">
          {t('footer.terms_and_conditions')}
        </Link>
      </div>
    </div>
  )
}
