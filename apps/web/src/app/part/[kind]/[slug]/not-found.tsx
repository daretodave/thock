import Link from 'next/link'
import { Container, Stack } from '@thock/ui'

export default function PartDetailNotFound() {
  return (
    <main id="main" className="flex-1">
    <Container as="section" className="py-24">
      <Stack gap={6}>
        <div className="flex flex-col gap-4">
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent">
            404 · part
          </span>
          <h1 className="font-serif text-h1 sm:text-display text-text">
            No part with that slug.
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            The part you followed isn&rsquo;t in our catalog yet, or the
            kind doesn&rsquo;t exist.
          </p>
        </div>
        <Link
          href="/"
          className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
        >
          ← back to home
        </Link>
      </Stack>
    </Container>
    </main>
  )
}
