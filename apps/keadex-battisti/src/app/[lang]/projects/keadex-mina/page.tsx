import { type Metadata, type NextPage } from 'next'
import keadexMina from '../../../../../public/img/keadex-mina-logo.svg'
import MinaAI from '../../../../components/MinaAI/MinaAI'
import MinaDetails from '../../../../components/MinaDetails/MinaDetails'
import MinaDocsIntegration from '../../../../components/MinaDocsIntegration/MinaDocsIntegration'
import MinaFAQ from '../../../../components/MinaFAQ/MinaFAQ'
import MinaPlantUML from '../../../../components/MinaPlantUML/MinaPlantUML'
import MinaProjectStructure from '../../../../components/MinaProjectStructure/MinaProjectStructure'
import MinaRendering from '../../../../components/MinaRendering/MinaRendering'
import MinaSummary from '../../../../components/MinaSummary/MinaSummary'
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
  return (
    <div className="overflow-x-hidden">
      <MinaSummary lang={lang} />
      <MinaDetails lang={lang} />
      <MinaPlantUML lang={lang} />
      <MinaRendering lang={lang} />
      <MinaProjectStructure lang={lang} />
      <MinaDocsIntegration lang={lang} />
      <MinaAI lang={lang} />
      <MinaFAQ lang={lang} />
    </div>
  )
}

export default KeadexMina
