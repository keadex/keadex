import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { PageProps } from './layout'

const KeadexSummary = dynamic(
  () => import('../../../components/KeadexSummary/KeadexSummary'),
)

const Home: NextPage<PageProps> = async ({ params }) => {
  const { lang } = await params
  return (
    <div className="overflow-x-hidden">
      <KeadexSummary lang={lang} />
    </div>
  )
}

export default Home
