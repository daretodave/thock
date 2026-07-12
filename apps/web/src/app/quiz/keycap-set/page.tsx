import type { ReactElement } from 'react'
import { Container } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  canonicalUrl,
  JsonLd,
} from '@thock/seo'
import { getAllKeycapSets } from '@/lib/data-runtime'
import { KeycapSetQuiz } from '@/components/quiz/KeycapSetQuiz'

export const metadata = buildMetadata({
  title: 'Find your keycap set',
  description:
    'Answer 4 questions and find your ideal keycap set from the thock catalog.',
  path: '/quiz/keycap-set',
})

const WEB_APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'thock keycap-set recommender',
  description:
    'A 4-question quiz that finds your ideal mechanical keyboard keycap set.',
  url: canonicalUrl('/quiz/keycap-set'),
  applicationCategory: 'UtilityApplication',
}

export default function QuizKeycapSetPage(): ReactElement {
  const keycapSets = getAllKeycapSets()
  return (
    <main id="main">
      <Container>
        <JsonLd
          graph={[
            WEB_APP_JSON_LD,
            buildBreadcrumbListJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Find your keycap set', path: '/quiz/keycap-set' },
            ]),
          ]}
        />
        <div className="mb-4 pt-8">
          <h1 className="text-h1 font-serif text-text mb-3">Find your keycap set</h1>
          <p className="text-body text-text-2 max-w-[55ch]">
            Answer four quick questions to find the keycap set that matches your profile,
            material, and availability preferences — then explore it on its detail page.
          </p>
        </div>
        <KeycapSetQuiz keycapSets={keycapSets} />
      </Container>
    </main>
  )
}
