import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'

export default function VendorsLoading(): ReactElement {
  return (
    <main id="main" className="flex-1">
      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <div className="h-3 w-24 bg-surface-2 rounded animate-pulse" />
          <div className="h-10 w-40 bg-surface-2 rounded animate-pulse" />
          <div className="h-5 w-64 bg-surface-2 rounded animate-pulse" />
        </Stack>
      </Container>
      <Container as="section" className="pb-16">
        <div className="flex flex-col gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-8 flex flex-col gap-3 border-b border-border">
              <div className="h-6 w-36 bg-surface-2 rounded animate-pulse" />
              <div className="h-4 w-full max-w-md bg-surface-2 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  )
}
