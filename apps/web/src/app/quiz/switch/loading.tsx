import { Container } from '@thock/ui'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

export default function QuizSwitchLoading() {
  return (
    <main id="main">
      <Container>
        <div className="py-12 max-w-2xl mx-auto">
          <PageSectionKicker className="mb-4 block">loading · quiz</PageSectionKicker>
          <div className="h-1 bg-surface rounded-full mb-8 animate-pulse" />
          <div className="h-8 bg-surface rounded w-3/4 mb-6 animate-pulse" />
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface rounded-lg border border-border animate-pulse" />
            ))}
          </div>
        </div>
      </Container>
    </main>
  )
}
