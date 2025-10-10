import { KeadexClientIds, urlBuilder } from '@keadex/keadex-utils/api'
import { createOAuthUserAuth } from '@octokit/auth-oauth-user'
import { NextRequest, NextResponse } from 'next/server'

type AuthParams = {
  clientId: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<AuthParams> },
) {
  const { clientId } = await params // explicitely added in the redirect_uri param by the client

  const code = request.nextUrl.searchParams.get('code') // coming from gh
  const ghClientId = process.env.GITHUB_CLIENT_ID
  const ghClientSecret = process.env.GITHUB_CLIENT_SECRET

  if (code && ghClientId && ghClientSecret && clientId) {
    const auth = createOAuthUserAuth({
      clientId: ghClientId,
      clientSecret: ghClientSecret,
      code,
    })

    const { token } = await auth()
    const redirectUrl = buildRedirectUrl(clientId, token)
    if (redirectUrl) return NextResponse.redirect(redirectUrl)
    else
      return new Response(`Unsupported client id: ${clientId}`, {
        status: 500,
      })
  } else {
    const missingParams = []
    if (!code) missingParams.push('code')
    if (!ghClientId) missingParams.push('ghClientId')
    if (!ghClientSecret) missingParams.push('ghClientSecret')
    if (!clientId) missingParams.push('clientId')

    return new Response(`Missing params: ${missingParams.join(',')}`, {
      status: 500,
    })
  }
}

function buildRedirectUrl(clientId: string, token: string) {
  let url
  switch (clientId) {
    case KeadexClientIds.MinaDesktop:
      url = 'mina://github-authenticated'
      break
    case KeadexClientIds.MinaWeb:
      url = urlBuilder('/en/mina-live/github-authenticated')
  }
  if (url) {
    return `${url}/${token}`
  }
  return
}
