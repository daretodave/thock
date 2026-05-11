'use client'

import Link from 'next/link'
import { Container, Mono, Stack } from '@thock/ui'

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main id="main" className="flex-1">
    <Container as="section" className="py-24">
      <Stack gap={4}>
        <span className="font-mono uppercase tracking-[0.12em] text-micro text-down">
          error · home
        </span>
        <h1 className="font-serif text-h1 sm:text-display text-text">
          Something went wrong loading the home page.
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
            href="/about"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            about thock →
          </Link>
        </div>
      </Stack>
    </Container>
    </main>
  )
}
