import { type Metadata, type NextPage } from 'next'
import Image from 'next/image'
import keadexMina from '../../../../../public/img/keadex-mina-logo.svg'
import { useTranslation } from '../../../i18n'
import { PageProps } from '../../layout'

const seo = {
  title: 'Keadex Mina',
  description:
    'Keadex Mina is a desktop application available for Linux, MacOS and Windows. It is based on the Diagram as Code concept: you can diagram software architectures by using C4 Model PlantUML code and adjust the rendered result. Mina is designed to be used in large projects and provides features to organize your diagrams.',
}

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: [
    'keadex mina',
    'c4 model',
    'diagram as code',
    'software architectures',
    'diagrams',
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

const KeadexMina: NextPage<PageProps> = async ({ params: { lang } }) => {
  const { t } = await useTranslation(lang)

  return (
    // <div className="about-me-page page font-light flex flex-col pb-20">
    <div className="h-screen px-10 align-middle flex flex-col">
      <div className="text-4xl !leading-loose my-auto text-center font-extralight">
        <a
          href="https://github.com/keadex/keadex/tree/main/apps/keadex-mina"
          target="_blank"
        >
          <Image
            src={keadexMina}
            alt="Keadex Mina Logo"
            className="mx-auto mb-10 lg:w-[36rem] w-[30rem]"
          />
        </a>
        <span className="text-link">{t('keadex_mina.title')}</span>
      </div>
    </div>
    // </div>
  )
}

export default KeadexMina
