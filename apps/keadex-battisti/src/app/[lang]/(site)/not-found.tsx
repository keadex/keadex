import { NextPage } from 'next'
import '../../../styles/index.css'
import { PageProps } from './layout'
import { getTranslation } from '../../i18n'
import { Button } from '@keadex/keadex-ui-kit/components/cross/Button/Button'
import Link from 'next/link'
import ROUTES, { HOME } from '../../../core/routes'

const Custom404: NextPage<PageProps> = async () => {
  const { t } = await getTranslation('en')

  return (
    <div className="page h-screen align-middle flex flex-col">
      <div className="m-auto flex flex-col text-center">
        <div className="text-9xl lg:text-[10rem] leading-none font-extrabold">
          404
        </div>
        <div className="text-xl lg:text-2xl">{t('not_found.title')}</div>
        <Link href={ROUTES[HOME].path} className="w-full mt-5 mb-20">
          <Button className="w-full pointer-events-none">
            {t('not_found.go_home')}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Custom404
