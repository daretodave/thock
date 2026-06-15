import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'

export default function ToolsLoading(): ReactElement {
  return (
    <main id="main" className="flex-1">
      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <div className="h-4 w-32 animate-pulse bg-surface-2 rounded" />
          <div className="h-10 w-40 animate-pulse bg-surface-2 rounded" />
          <div className="h-6 w-72 animate-pulse bg-surface-2 rounded" />
        </Stack>
      </Container>
      <Container as="section" className="pb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3 border border-border p-6">
              <div className="h-7 w-40 animate-pulse bg-surface-2 rounded" />
              <div className="h-16 animate-pulse bg-surface-2 rounded" />
              <div className="h-4 w-28 animate-pulse bg-surface-2 rounded" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  )
}
