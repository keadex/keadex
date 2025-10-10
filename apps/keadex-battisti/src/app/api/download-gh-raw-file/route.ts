import { KEADEX_HEADERS } from '@keadex/keadex-utils/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const ghToken = request.headers.get(KEADEX_HEADERS.GH_AUTH)
  const ghUrl = request.headers.get(KEADEX_HEADERS.GH_URL)
  if (!ghUrl)
    return NextResponse.json({ message: 'Invalid GitHub URL' }, { status: 400 })
  else {
    const ghHeader: Headers | undefined = ghToken
      ? new Headers({
          Authorization: `token ${ghToken}`,
        })
      : undefined

    const response = await fetch(ghUrl, {
      method: 'GET',
      headers: ghHeader,
    })
    const body = response.status === 200 ? await response.blob() : null
    return new Response(body, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  }
}
