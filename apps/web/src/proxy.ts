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
 * Runs only on /article and /tag paths that contain an uppercase
 * character (see `config.matcher`), so the common lowercase page view
 * never invokes a function and stays a pure CDN hit.
 */
export function proxy(request: NextRequest): NextResponse {
  return caseNormalizeRedirect(request) ?? NextResponse.next()
}

export const config = {
  matcher: [
    // An uppercase letter somewhere in the path, under a
    // case-insensitive article/ or tag/ prefix.
    '/((?=.*[A-Z])(?:[Aa][Rr][Tt][Ii][Cc][Ll][Ee]|[Tt][Aa][Gg])(?:/.*)?)',
  ],
}
