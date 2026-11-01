import Link from 'next/link'
import { Container, Stack } from '@thock/ui'
import { SuggestedArticles } from './SuggestedArticles'

/**
 * Entity-specific 404 body for /article/<unknown-slug>. Rendered by the
 * root `app/not-found.tsx` via `RouteAwareNotFound` (the route sets
 * `dynamicParams = false`, so Next serves the root boundary with a
 * real 404 status; segment-level not-found files are bypassed).
 */
export function ArticleNotFound({ slug }: { slug: string }) {
  return (
    <Container as="section" className="py-24">
      <Stack gap={6}>
        <div className="flex flex-col gap-4">
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent">
            404 · article
          </span>
          <h1 className="font-serif text-h1 sm:text-display text-text">
            That article doesn&rsquo;t exist (yet).
          </h1>
          <p className="max-w-60ch font-serif text-h3 text-text-2">
            The slug you followed isn&rsquo;t in our archives. Either it never
            shipped, or the link is wrong.
          </p>
        </div>

        <SuggestedArticles slug={slug} />

        <Link
          href="/"
          className="rounded-xs font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
        >
          ← back to home
        </Link>
      </Stack>
    </Container>
  )
}
