import { NextRequest, NextResponse } from 'next/server'

export function minaMiddleware(req: NextRequest): NextResponse<unknown> | void {
  if (
    req.headers.get('referer')?.match(/.*\/mina-live$/) &&
    req.nextUrl.pathname.match(/.*\.(svg|png|jpeg|jpg)/)
  ) {
    const filename = req.nextUrl.pathname.substring(
      req.nextUrl.pathname.lastIndexOf('/') + 1,
    )
    return NextResponse.rewrite(
      new URL(`/_next/static/keadex-mina/${filename}`, req.url),
    )
  }
}
