import { Container, Stack } from '@thock/ui'

export default function HomeLoading() {
  return (
    <Container as="section" className="py-12 sm:py-16">
      <Stack gap={6}>
        <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-4">
          loading · home
        </span>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="aspect-[16/10] animate-pulse bg-surface" />
          <div className="flex flex-col gap-3">
            <div className="h-12 w-3/4 animate-pulse bg-surface" />
            <div className="h-6 w-2/3 animate-pulse bg-surface" />
            <div className="h-6 w-1/2 animate-pulse bg-surface" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[110px] animate-pulse bg-surface"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse bg-surface"
            />
          ))}
        </div>
      </Stack>
    </Container>
  )
}
