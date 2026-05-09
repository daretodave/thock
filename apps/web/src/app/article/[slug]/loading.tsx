import { Container, Stack } from '@thock/ui'

export default function ArticleLoading() {
  return (
    <Container as="section" className="py-16">
      <Stack gap={5}>
        <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-4">
          loading
        </span>
        <div className="h-12 w-3/4 max-w-[60ch] animate-pulse bg-surface" />
        <div className="h-6 w-2/3 max-w-[60ch] animate-pulse bg-surface" />
        <div className="h-6 w-1/2 max-w-[60ch] animate-pulse bg-surface" />
        <div className="mt-6 flex flex-col gap-3">
          <div className="h-4 w-full max-w-[60ch] animate-pulse bg-surface" />
          <div className="h-4 w-full max-w-[60ch] animate-pulse bg-surface" />
          <div className="h-4 w-5/6 max-w-[60ch] animate-pulse bg-surface" />
        </div>
      </Stack>
    </Container>
  )
}
