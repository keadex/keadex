import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { PageProps } from './layout'

const KeadexSummary = dynamic(
  () => import('../../components/KeadexSummary/KeadexSummary'),
)
const ProjectsSummary = dynamic(
  () => import('../../components/ProjectsSummary/ProjectsSummary'),
)
const DocsSummary = dynamic(
  () => import('../../components/DocsSummary/DocsSummary'),
)
const AboutMeSummary = dynamic(
  () => import('../../components/AboutMeSummary/AboutMeSummary'),
)

const Home: NextPage<PageProps> = async ({ params: { lang } }) => {
  return (
    <div className="overflow-x-hidden">
      <KeadexSummary lang={lang} />
      <ProjectsSummary lang={lang} />
      <DocsSummary lang={lang} />
      <AboutMeSummary lang={lang} />
    </div>
  )
}

export default Home
