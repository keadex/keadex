import { type Metadata, type NextPage } from 'next'
import Image from 'next/image'
import minaLogo from '../../../../../../public/img/keadex-mina-logo-color.svg'
import keadexMina from '../../../../../../public/img/keadex-mina-logo.svg'
import MinaShareDiagramComponent from '../../../../../components/MinaShareDiagram/MinaShareDiagram'
import { useTranslation } from '../../../../i18n'
import { PageProps } from '../../../layout'
import ROUTES, { PROJECT_KEADEX_MINA } from '../../../../../core/routes'

const seo = {
  title: 'Keadex Mina - Share Diagram',
  description:
    'Use this page to share architectural diagrams created with Keadex Mina.',
}

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: [
    'keadex mina',
    'share diagram',
    'c4 model',
    'diagram as code',
    'software architectures',
  ],
  openGraph: {
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: keadexMina.src,
      },
    ],
  },
}

const MinaShareDiagram: NextPage<PageProps> = async ({ params: { lang } }) => {
  const { t } = await useTranslation(lang)
  return (
    <div className="page font-light flex flex-col pt-10 pb-10">
      <div className="flex flex-col my-auto">
        <a href={ROUTES[PROJECT_KEADEX_MINA].path} target="_blank">
          <Image
            src={minaLogo}
            alt="Keadex Mina Logo"
            className="w-[15rem] md:w-[20rem] mx-auto mt-3 mb-12"
          />
        </a>
        <h2>{t('keadex_mina.share_diagram.title')}</h2>
        <h4
          dangerouslySetInnerHTML={{
            __html: t('keadex_mina.share_diagram.description'),
          }}
        />
        <MinaShareDiagramComponent lang={lang} className="mt-8" />
      </div>
    </div>
  )
}

export default MinaShareDiagram
