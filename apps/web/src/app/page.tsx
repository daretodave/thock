import Link from 'next/link'
import { Container, Stack } from '@thock/ui'
import { siteConfig } from '@/lib/siteConfig'

/**
 * Phase 1 placeholder home. The full home page (hero pick, trending,
 * latest-by-pillar, group-buys widget) lands in phase 6.
 */
export default function HomePage() {
  return (
    <Container as="section" className="py-16 sm:py-24">
      <Stack gap={5}>
        <span className="font-mono uppercase tracking-[0.1em] text-text-3 text-micro">
          phase 1 · bootstrap
        </span>
        <h1 className="font-serif text-display text-text">{siteConfig.name}</h1>
        <p className="max-w-[60ch] text-text-2 text-h3 font-serif">
          {siteConfig.description}
        </p>
        <div>
          <Link
            href="/about"
            className="inline-block border border-border-hi px-4 py-2 font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:bg-surface hover:text-text transition-colors"
          >
            Read the spec
          </Link>
        </div>
      </Stack>
    </Container>
  )
}
