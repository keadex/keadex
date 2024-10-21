import { NextRequest, NextResponse } from 'next/server'

export function minaMiddleware(req: NextRequest): NextResponse<unknown> | void {
  if (req.nextUrl.pathname.match(/keadex-mina.*\.(svg|png|jpeg|jpg)/)) {
    const filename = req.nextUrl.pathname.substring(
      req.nextUrl.pathname.lastIndexOf('/') + 1,
    )
    return NextResponse.rewrite(
      new URL(`/_next/static/keadex-mina/${filename}`, req.url),
    )
  }
}
