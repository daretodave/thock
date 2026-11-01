import type { Metadata } from 'next'
import { siteConfig } from '@thock/seo'
import { RootNotFound } from '@/components/not-found/RootNotFound'
import { RouteAwareNotFound } from '@/components/not-found/RouteAwareNotFound'

export const metadata: Metadata = {
  title: { absolute: `Page not found — ${siteConfig.name}` },
  description: 'That URL doesn’t match anything on thock.',
  // No explicit `robots` field: Next.js auto-injects
  // `<meta name="robots" content="noindex">` for every notFound()
  // render (next/dist/server/app-render/make-get-server-inserted-html.js,
  // unconditional on HTTPAccessFallbackError). Declaring our own
  // `robots` here would render a second, conflicting meta tag
  // alongside the framework's — confirmed live on every 404 across
  // the site before this fix.
}

/**
 * Global root-level 404. Next.js renders this for any unmatched URL
 * and for every `dynamicParams = false` miss. `RouteAwareNotFound`
 * swaps in entity copy + "did you mean" suggestions for
 * /article/<slug> and /tag/<slug>; everything else gets the generic
 * branded page.
 */
export default function NotFound() {
  return (
    <main id="main" className="flex-1">
      <RouteAwareNotFound fallback={<RootNotFound />} />
    </main>
  )
}
