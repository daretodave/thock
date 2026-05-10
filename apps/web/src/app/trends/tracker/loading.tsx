import { Container, Stack } from '@thock/ui'

export default function TrackerLoading() {
  return (
    <main className="flex-1">
      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-4">
            loading · tracker
          </span>
          <div className="h-12 w-3/4 animate-pulse bg-surface" />
          <div className="h-6 w-2/3 max-w-[60ch] animate-pulse bg-surface" />
        </Stack>
      </Container>
      <Container as="section" className="pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] animate-pulse bg-surface"
            />
          ))}
        </div>
      </Container>
    </main>
  )
}
