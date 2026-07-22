import Link from 'next/link'
import { Container, Stack } from '@thock/ui'

export default function PartIndexNotFound() {
  return (
    <main id="main" className="flex-1">
    <Container as="section" className="py-24">
      <Stack gap={6}>
        <div className="flex flex-col gap-4">
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent">
            404 · catalog
          </span>
          <h1 className="font-serif text-h1 sm:text-display text-text">
            Unknown part kind.
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            The catalog is split into <code>switch</code>,{' '}
            <code>keycap-set</code>, and <code>board</code>. Try one of
            those.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-small uppercase tracking-[0.08em] text-text-2">
          <Link
            href="/part/switch"
            className="rounded-sm hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
          >
            /part/switch
          </Link>
          <Link
            href="/part/keycap-set"
            className="rounded-sm hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
          >
            /part/keycap-set
          </Link>
          <Link
            href="/part/board"
            className="rounded-sm hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
          >
            /part/board
          </Link>
        </div>
        <Link
          href="/"
          className="rounded-sm font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
        >
          ← back to home
        </Link>
      </Stack>
    </Container>
    </main>
  )
}
