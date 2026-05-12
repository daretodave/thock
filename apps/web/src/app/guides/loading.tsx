import { Container, Stack } from '@thock/ui'

export default function GuidesLoading() {
  return (
    <main id="main" className="flex-1">
      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-4">
            loading · pillar
          </span>
          <div className="h-12 w-1/3 animate-pulse bg-surface" />
          <div className="h-6 w-2/3 max-w-[60ch] animate-pulse bg-surface" />
        </Stack>
      </Container>
      <Container as="section" className="pb-12 sm:pb-16">
        <Stack gap={5}>
          <div className="h-6 w-1/4 animate-pulse bg-surface" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-4 border-t border-border py-5 sm:grid-cols-[200px_1fr] sm:gap-6"
            >
              <div className="aspect-[4/3] animate-pulse bg-surface" />
              <div className="flex flex-col gap-3">
                <div className="h-4 w-1/4 animate-pulse bg-surface" />
                <div className="h-6 w-3/4 animate-pulse bg-surface" />
              </div>
            </div>
          ))}
        </Stack>
      </Container>
    </main>
  )
}
