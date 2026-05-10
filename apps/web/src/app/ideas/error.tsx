'use client'

import Link from 'next/link'
import { Container, Mono, Stack } from '@thock/ui'

export default function IdeasError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex-1">
    <Container as="section" className="py-24">
      <Stack gap={4}>
        <span className="font-mono uppercase tracking-[0.12em] text-micro text-down">
          error · ideas
        </span>
        <h1 className="font-serif text-h1 sm:text-display text-text">
          The Ideas pillar failed to load.
        </h1>
        <p className="max-w-[60ch] font-serif text-h3 text-text-2">
          A loader probably tripped on a malformed record. The incident has
          a digest you can quote when reporting.
        </p>
        {error.digest && (
          <Mono className="text-small text-down">digest: {error.digest}</Mono>
        )}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={reset}
            className="border border-border-hi px-4 py-2 font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            Try again
          </button>
          <Link
            href="/"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            ← back to home
          </Link>
        </div>
      </Stack>
    </Container>
    </main>
  )
}
