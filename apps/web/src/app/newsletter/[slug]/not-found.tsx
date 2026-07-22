import type { ReactElement } from 'react'
import Link from 'next/link'
import { Container, Stack } from '@thock/ui'

export default function NewsletterNotFound(): ReactElement {
  return (
    <main id="main" className="flex-1">
      <Container className="py-16">
        <Stack gap={4}>
          <h1 className="font-serif text-h1 text-text">Issue not found</h1>
          <p className="text-body text-text-2">
            This newsletter issue is not in the thock archive.
          </p>
          <Link
            href="/newsletter"
            className="rounded-sm font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
          >
            ← all issues
          </Link>
        </Stack>
      </Container>
    </main>
  )
}
