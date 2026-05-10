import { NextResponse, type NextRequest } from 'next/server'

/**
 * Forwards the current pathname into an `x-pathname` request
 * header so Server Components (notably `not-found.tsx` files)
 * can read which slug a reader was trying to reach.
 *
 * Used by `apps/web/src/app/article/[slug]/not-found.tsx` and the
 * sibling tag not-found page to render "did you mean…?" search
 * suggestions when an unknown slug 404s.
 */
export function middleware(request: NextRequest): NextResponse {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    /*
     * Match every path except API, _next internals, and static
     * assets. Keeps middleware overhead off image / font / chunk
     * fetches.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|hero-art|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
}
