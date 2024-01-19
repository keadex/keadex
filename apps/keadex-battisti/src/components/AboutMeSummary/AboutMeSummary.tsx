'use client'

import { Button } from '@keadex/keadex-ui-kit/cross'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { Trans } from 'react-i18next'
import me from '../../../public/img/me.png'
import { useTranslation } from '../../app/i18n/client'
import ROUTES, { ABOUT_ME } from '../../core/routes'
import { AnimationOnScroll } from 'react-animation-on-scroll'

export type AboutMeSummaryProps = {
  lang: string
}

export default function AboutMeSummary({
  children,
  lang,
}: PropsWithChildren<AboutMeSummaryProps>) {
  const { t } = useTranslation(lang)
  const router = useRouter()

  return (
    <div className="min-h-screen px-10 py-20 align-middle flex flex-col bg-primary">
      <div className="text-xl md:text-xl lg:text-xl !leading-loose my-auto font-extralight flex flex-col">
        <h1 className="text-center w-full block text-4xl font-bold pb-14">
          {t('common.about_me')}
        </h1>
        <div>
          <AnimationOnScroll animateIn="animate__fadeIn">
            <Image
              src={me}
              alt="Me and Rocky"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg md:float-left md:mr-10 md:mb-0 mb-10 mx-auto md:mx-0"
            />
          </AnimationOnScroll>
          <div>
            <Trans
              i18nKey="home.about_me_summary"
              t={t}
              components={{ span: <span /> }}
            />
          </div>
        </div>
        <div className="text-center text-lg w-full mt-10 flex flex-col">
          <span className="font-normal">
            {t('common.question.interested_knowing_me')}
          </span>
          <Button
            onClick={() => router.push(ROUTES[ABOUT_ME].path)}
            className="w-60 mt-5 mx-auto"
          >
            {t('home.check_my_full_profile')}
          </Button>
        </div>
      </div>
    </div>
  )
}
