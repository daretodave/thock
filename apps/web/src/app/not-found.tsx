import type { Metadata } from 'next'
import { siteConfig } from '@thock/seo'
import { RootNotFound } from '@/components/not-found/RootNotFound'

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
 * Global root-level 404. Next.js falls back to this page for any
 * URL that doesn't match a route segment. /article/[slug] and
 * /tag/[slug] have their own not-found.tsx so they can show
 * entity-specific copy; this page covers everything else.
 */
export default function NotFound() {
  return (
    <main id="main" className="flex-1">
      <RootNotFound />
    </main>
  )
}
