import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

export default function VendorDetailLoading(): ReactElement {
  return (
    <main id="main" className="flex-1">
      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <PageSectionKicker>loading · vendor</PageSectionKicker>
          <div className="h-10 w-48 bg-surface-2 rounded animate-pulse" />
          <div className="h-4 w-32 bg-surface-2 rounded animate-pulse" />
          <div className="h-16 w-full max-w-lg bg-surface-2 rounded animate-pulse" />
        </Stack>
      </Container>
    </main>
  )
}
