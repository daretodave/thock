import type { ReactElement } from 'react'
import { Container } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  canonicalUrl,
  JsonLd,
} from '@thock/seo'
import { getAllBoards } from '@/lib/data-runtime'
import { BoardQuiz } from '@/components/quiz/BoardQuiz'

export const metadata = buildMetadata({
  title: 'Find your board',
  description:
    'Answer 5 questions and find your ideal mechanical keyboard from the thock catalog.',
  path: '/quiz/board',
})

const WEB_APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'thock board recommender',
  description:
    'A 5-question quiz that finds your ideal mechanical keyboard.',
  url: canonicalUrl('/quiz/board'),
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

export default function QuizBoardPage(): ReactElement {
  const boards = getAllBoards()
  return (
    <main id="main" className="flex-1">
      <Container>
        <JsonLd
          graph={[
            WEB_APP_JSON_LD,
            buildBreadcrumbListJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Find your board', path: '/quiz/board' },
            ]),
          ]}
        />
        <div className="mb-4 pt-8">
          <h1 className="text-h1 font-serif text-text mb-3">Find your board</h1>
          <p className="text-body text-text-2 max-w-55ch">
            Answer five questions about layout, mount style, case material, hotswap, and
            wireless — get your top board matches from the thock catalog, then explore the
            full spec on its page.
          </p>
        </div>
        <BoardQuiz boards={boards} />
      </Container>
    </main>
  )
}
