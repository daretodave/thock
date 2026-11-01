import { NextResponse, type NextRequest } from 'next/server'

/**
 * Canonicalizes non-lowercase hits on `/article/*` and `/tag/*`
 * (e.g. `/Article/<slug>`) to their lowercase form with a 308.
 * Every catalog slug in the repo is already lowercase.
 */
export function caseNormalizeRedirect(
  request: NextRequest,
): NextResponse | null {
  const { pathname } = request.nextUrl
  const match = pathname.match(/^\/(article|tag)(\/.*)?$/i)
  if (!match) return null
  const lowered = pathname.toLowerCase()
  if (lowered === pathname) return null
  const url = request.nextUrl.clone()
  url.pathname = lowered
  return NextResponse.redirect(url, 308)
}

/**
 * Forwards the current pathname into an `x-pathname` request
 * header so Server Components (notably `not-found.tsx` files)
 * can read which slug a reader was trying to reach.
 *
 * Kept for Server Components that need the request path; the 404
 * pages themselves read it client-side via `RouteAwareNotFound`.
 */
export function proxy(request: NextRequest): NextResponse {
  const redirect = caseNormalizeRedirect(request)
  if (redirect) return redirect

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    /*
     * Match every path except API, _next internals, and static
     * assets. Keeps proxy overhead off image / font / chunk
     * fetches.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|hero-art|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
}
