import { type Metadata, type NextPage } from 'next'
import keadexMina from '../../../../../public/img/keadex-mina-logo.svg'
import { PageProps } from '../layout'
import MinaLiveClient from '../../../../components/MinaLiveClient/MinaLiveClient'

const seo = {
  title: 'Keadex Mina Live Editor',
  description:
    'Keadex Mina is an application based on the Diagram as Code concept: you can diagram software architectures by using C4 Model PlantUML code and adjust the rendered result. Mina is designed to be used in large projects and provides features to organize your diagrams.',
}

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: [
    'keadex mina',
    'live editor',
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

const MinaLiveEditor: NextPage<PageProps> = async () => {
  return (
    <div className="page font-light flex flex-col pb-10">
      <MinaLiveClient />
    </div>
  )
}

export default MinaLiveEditor
