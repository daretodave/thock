import type { ReactElement } from 'react'
import Link from 'next/link'
import { Container, Stack } from '@thock/ui'

export default function VendorNotFound(): ReactElement {
  return (
    <main id="main" className="flex-1">
      <Container className="py-16">
        <Stack gap={4}>
          <h1 className="font-serif text-h1 text-text">Vendor not found</h1>
          <p className="text-body text-text-2">
            This vendor is not in the thock catalog.
          </p>
          <Link
            href="/vendors"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            ← browse all vendors
          </Link>
        </Stack>
      </Container>
    </main>
  )
}
