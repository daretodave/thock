import { NextResponse, type NextRequest } from 'next/server'

/**
 * `/article/[slug]` and `/tag/[slug]` are the only two entity routes
 * that keep `dynamicParams` at the Next.js default (see the comment
 * at `app/article/[slug]/page.tsx`), which forces dynamic rendering
 * and, as a side effect, makes the literal `article`/`tag` path
 * segment match case-insensitively — `/Article/<slug>` and
 * `/ARTICLE/<slug>` both 200 instead of 404ing or canonicalizing.
 * Every catalog slug in the repo is already lowercase, so redirect
 * any non-lowercase hit on these two segments to its canonical form.
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
 * Used by `apps/web/src/app/article/[slug]/not-found.tsx` and the
 * sibling tag not-found page to render "did you mean…?" search
 * suggestions when an unknown slug 404s.
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
