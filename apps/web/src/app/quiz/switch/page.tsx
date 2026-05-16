import type { ReactElement } from 'react'
import { Container } from '@thock/ui'
import { buildMetadata, JsonLd } from '@thock/seo'
import { getAllSwitches } from '@/lib/data-runtime'
import { SwitchQuiz } from '@/components/quiz/SwitchQuiz'

export const metadata = buildMetadata({
  title: 'Find your switch',
  description:
    'Answer 4 questions and find your ideal mechanical keyboard switch from the thock catalog.',
  path: '/quiz/switch',
})

const WEB_APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'thock switch recommender',
  description:
    'A 4-question quiz that finds your ideal mechanical keyboard switch.',
  url: 'https://thock.xyz/quiz/switch',
  applicationCategory: 'UtilityApplication',
}

export default function QuizSwitchPage(): ReactElement {
  const switches = getAllSwitches()
  return (
    <main id="main">
      <Container>
        <JsonLd graph={WEB_APP_JSON_LD} />
        <div className="mb-4 pt-8">
          <h1 className="text-h1 font-serif text-text mb-3">Find your switch</h1>
          <p className="text-body text-text-2 max-w-[55ch]">
            Answer four quick questions to find the mechanical keyboard switch that matches
            your typing style — then explore the full spec on its page.
          </p>
        </div>
        <SwitchQuiz switches={switches} />
      </Container>
    </main>
  )
}
