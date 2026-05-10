import { Container, Stack } from '@thock/ui'

export default function PartDetailLoading() {
  return (
    <>
      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-4">
            loading · part
          </span>
          <div className="h-12 w-2/3 animate-pulse bg-surface" />
          <div className="h-5 w-1/3 animate-pulse bg-surface" />
        </Stack>
      </Container>
      <Container as="section" className="pb-8">
        <div className="h-4 w-1/4 animate-pulse bg-surface mb-5" />
        <div className="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="contents">
              <div className="h-4 w-24 animate-pulse bg-surface" />
              <div className="h-4 w-2/3 animate-pulse bg-surface" />
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}
