import { type NextPage } from 'next'
import { PageParams } from '../../../layout'
import GhAuthenticatedWebhook from '../../../../../components/GhAuthenticatedWebhook/GhAuthenticatedWebhook'

type GitHubAuthenticatedPageProps = {
  params: Promise<PageParams & { token: string }>
}

const GitHubAuthenticated: NextPage<GitHubAuthenticatedPageProps> = async ({
  params,
}) => {
  const { token } = await params

  return <GhAuthenticatedWebhook token={token} />
}

export default GitHubAuthenticated
