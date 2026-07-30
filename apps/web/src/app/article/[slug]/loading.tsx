import { Container, Stack } from '@thock/ui'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

export default function ArticleLoading() {
  return (
    <main id="main" className="flex-1">
      <Container as="section" className="py-12 sm:py-16">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-12">
          <div className="flex flex-col gap-5 max-w-[60ch] xl:flex-shrink-0">
            <PageSectionKicker>loading</PageSectionKicker>
            <div className="h-12 w-3/4 max-w-[60ch] animate-pulse bg-surface" />
            <div className="h-6 w-2/3 max-w-[60ch] animate-pulse bg-surface" />
            <div className="h-6 w-1/2 max-w-[60ch] animate-pulse bg-surface" />
            <div className="mt-6 flex flex-col gap-3">
              <div className="h-4 w-full max-w-[60ch] animate-pulse bg-surface" />
              <div className="h-4 w-full max-w-[60ch] animate-pulse bg-surface" />
              <div className="h-4 w-5/6 max-w-[60ch] animate-pulse bg-surface" />
            </div>
          </div>
          <div className="w-full max-w-[60ch] xl:max-w-none xl:flex-1">
            <div className="aspect-[16/10] animate-pulse rounded-md bg-surface" />
          </div>
        </div>
      </Container>
    </main>
  )
}
