import { Container, Stack } from '@thock/ui'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

export default function PartsLoading() {
  return (
    <main id="main" className="flex-1">
      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <PageSectionKicker>loading · catalog</PageSectionKicker>
          <div className="h-12 w-1/4 animate-pulse bg-surface" />
          <div className="h-6 w-2/3 max-w-[60ch] animate-pulse bg-surface" />
        </Stack>
      </Container>
      <Container as="section" className="pb-16">
        <div className="flex flex-col divide-y divide-border">
          {[0, 1, 2].map((i) => (
            <div key={i} className="py-8 flex flex-col gap-3">
              <div className="h-8 w-1/3 animate-pulse bg-surface" />
              <div className="h-4 w-2/3 max-w-[60ch] animate-pulse bg-surface" />
              <div className="h-4 w-24 animate-pulse bg-surface" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  )
}
