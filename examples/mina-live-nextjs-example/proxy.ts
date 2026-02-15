import { NextResponse, NextRequest } from "next/server";
import { minaMiddleware } from "@keadex/mina-live/nextjs-middleware";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

export function proxy(req: NextRequest) {
  const minaMiddlewareResponse = minaMiddleware(req);
  if (minaMiddlewareResponse) {
    return minaMiddlewareResponse;
  } else {
    return NextResponse.next();
  }
}
