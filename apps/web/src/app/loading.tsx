import { Container, Stack } from '@thock/ui'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

/**
 * Global root-level loading boundary. Next.js falls back to this
 * component for any route segment that doesn't define its own
 * loading.tsx — home plus every route without a scoped boundary
 * (about, article/[slug], compare/*, newsletter, part/*, search,
 * sources, tag/[slug], tags, vendor/[slug]), so the skeleton stays
 * route-agnostic. Route families with a local loading.tsx (news,
 * trends, guides, ideas, deep-dives, group-buys, quiz, tools,
 * trends/tracker, archive) show entity-shaped skeletons instead.
 */
export default function RootLoading() {
  return (
    <main id="main" className="flex-1">
      <Container as="section" className="py-12 sm:py-16">
      <Stack gap={6}>
        <PageSectionKicker>loading</PageSectionKicker>
        <div className="flex flex-col gap-3">
          <div className="h-10 w-2/3 animate-pulse bg-surface" />
          <div className="h-5 w-1/2 max-w-[60ch] animate-pulse bg-surface" />
          <div className="h-5 w-1/3 max-w-[60ch] animate-pulse bg-surface" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse bg-surface" />
          ))}
        </div>
      </Stack>
      </Container>
    </main>
  )
}
