'use client'

import { useSyncExternalStore, type ReactElement, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ArticleNotFound } from './ArticleNotFound'
import { TagNotFound } from './TagNotFound'

/**
 * Picks the 404 body from the requested pathname. `/article/[slug]`
 * and `/tag/[slug]` set `dynamicParams = false` so unknown slugs get
 * a real HTTP 404, which makes Next skip their segment-level
 * not-found boundaries and render the root one; this component
 * restores the entity copy + "did you mean" suggestions there.
 * Everything else falls through to the generic root 404.
 *
 * The swap happens after mount, never during hydration: on Vercel a
 * `dynamicParams = false` miss is served from the prerendered static
 * `/_not-found` page, whose HTML was rendered for that path, not the
 * requested one. Server and first client render both show the
 * fallback, so there is no hydration mismatch.
 */
export function RouteAwareNotFound({
  fallback,
}: {
  fallback: ReactNode
}): ReactElement {
  const pathname = usePathname()
  const mounted = useSyncExternalStore(noopSubscribe, isClient, isServer)
  const match = mounted ? matchEntityRoute(pathname) : null
  if (match?.kind === 'article') return <ArticleNotFound slug={match.slug} />
  if (match?.kind === 'tag') return <TagNotFound slug={match.slug} />
  return <>{fallback}</>
}

const noopSubscribe = () => () => {}
const isClient = () => true
const isServer = () => false

export function matchEntityRoute(
  pathname: string | null,
): { kind: 'article' | 'tag'; slug: string } | null {
  const m = pathname?.match(/^\/(article|tag)\/([^/]+)\/?$/)
  if (!m) return null
  return { kind: m[1] as 'article' | 'tag', slug: decodeURIComponent(m[2]!) }
}
