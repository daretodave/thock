import type { Metadata } from 'next'
import { siteConfig } from '@thock/seo'
import { RootNotFound } from '@/components/not-found/RootNotFound'

export const metadata: Metadata = {
  title: { absolute: `Page not found — ${siteConfig.name}` },
  description: 'That URL doesn’t match anything on thock.',
  robots: { index: false, follow: false },
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
