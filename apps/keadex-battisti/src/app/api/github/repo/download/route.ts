import { KEADEX_HEADERS } from '@keadex/keadex-utils/api'
import { createOAuthUserAuth } from '@octokit/auth-oauth-user'
import { Octokit } from '@octokit/core'
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods'
import { NextRequest, NextResponse } from 'next/server'
import { RequestError } from '@octokit/request-error'

const RESTOctokit = Octokit.plugin(restEndpointMethods)

export async function GET(request: NextRequest) {
  const requiredHeaders = [
    KEADEX_HEADERS.GH_TOKEN,
    KEADEX_HEADERS.GH_REPO,
    KEADEX_HEADERS.GH_OWNER,
    KEADEX_HEADERS.GH_BRANCH,
  ]
  const ghToken = request.headers.get(KEADEX_HEADERS.GH_TOKEN)
  const ghRepo = request.headers.get(KEADEX_HEADERS.GH_REPO)
  const ghOwner = request.headers.get(KEADEX_HEADERS.GH_OWNER)
  const ghBranch = request.headers.get(KEADEX_HEADERS.GH_BRANCH)
  if (!ghToken || !ghRepo || !ghOwner || !ghBranch) {
    return NextResponse.json(
      { message: `Missing required headers: ${requiredHeaders.join(', ')}` },
      { status: 400 },
    )
  } else {
    const octokit = new RESTOctokit({
      authStrategy: createOAuthUserAuth,
      auth: {
        token: ghToken,
      },
    })
    try {
      const response = await octokit.rest.repos.downloadZipballArchive({
        owner: ghOwner,
        repo: ghRepo,
        ref: ghBranch,
      })
      const blob = (await response.data) as BodyInit
      return new Response(blob, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename=${ghRepo}-${ghBranch}.zip`,
        },
      })
    } catch (error) {
      if (error instanceof RequestError) {
        const message = error.message
        const status = error.status
        return NextResponse.json({ message }, { status })
      } else {
        return NextResponse.json(
          { message: 'Unknown error, not instance of Error' },
          { status: 500 },
        )
      }
    }
  }
}
