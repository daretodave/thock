import { Container, Stack } from '@thock/ui'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

export default function ArchiveLoading() {
  return (
    <main id="main" className="flex-1">
      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <PageSectionKicker>browse · by date</PageSectionKicker>
          <div className="h-12 w-1/4 animate-pulse bg-surface" />
          <div className="h-6 w-2/3 max-w-[60ch] animate-pulse bg-surface" />
        </Stack>
      </Container>
      <Container as="section" className="pb-16">
        <div className="flex flex-col gap-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="h-8 w-1/4 animate-pulse bg-surface border-b border-border pb-3" />
              {[0, 1, 2].map((j) => (
                <div key={j} className="h-5 w-3/4 animate-pulse bg-surface" />
              ))}
            </div>
          ))}
        </div>
      </Container>
    </main>
  )
}
