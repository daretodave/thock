import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

export default function NewsletterDetailLoading(): ReactElement {
  return (
    <main id="main" className="flex-1">
      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <PageSectionKicker>loading · newsletter</PageSectionKicker>
          <div className="h-12 w-3/4 max-w-[60ch] animate-pulse bg-surface" />
          <div className="h-4 w-32 animate-pulse bg-surface" />
          <div className="h-6 w-2/3 max-w-[60ch] animate-pulse bg-surface" />
        </Stack>
      </Container>
    </main>
  )
}
