import type { ReactElement } from 'react'
import Link from 'next/link'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

const PATH = '/tools'

export const metadata = buildMetadata({
  title: 'Interactive tools',
  description:
    'Find your ideal switch or keycap set with the thock recommender quizzes, or compare boards and switches side-by-side.',
  path: PATH,
})

type Tool = {
  href: string
  heading: string
  description: string
  cta: string
  testId: string
}

const TOOLS: Tool[] = [
  {
    href: '/quiz/switch',
    heading: 'Find your switch',
    description:
      'Answer 4 questions about feel, sound, and use — get your top switch matches from the thock catalog.',
    cta: 'Start the quiz',
    testId: 'tools-card-quiz-switch',
  },
  {
    href: '/quiz/keycap-set',
    heading: 'Find your keycap set',
    description:
      'Tell us your profile, material, and legends preferences — get your top keycap-set matches.',
    cta: 'Start the quiz',
    testId: 'tools-card-quiz-keycap-set',
  },
  {
    href: '/compare/switch',
    heading: 'Compare switches',
    description:
      'Pick any two switches and see them side-by-side: type, housing, stem, spring, travel, and more.',
    cta: 'Open the comparison tool',
    testId: 'tools-card-compare-switch',
  },
  {
    href: '/compare/board',
    heading: 'Compare boards',
    description:
      'Pick any two boards and compare layout, mount style, case material, hotswap, wireless, and release date.',
    cta: 'Open the comparison tool',
    testId: 'tools-card-compare-board',
  },
]

export default function ToolsPage(): ReactElement {
  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: 'Interactive tools — thock',
            description:
              'Recommender quizzes and side-by-side comparison tools for mechanical keyboard switches, keycap sets, and boards.',
            path: PATH,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: PATH },
          ]),
          buildItemListJsonLd({
            name: 'Interactive tools',
            items: TOOLS.map((t) => ({ name: t.heading, path: t.href })),
          }),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <PageSectionKicker testId="tools-eyebrow">
            interactive tools
          </PageSectionKicker>
          <h1
            data-testid="tools-h1"
            className="font-serif italic text-h1 sm:text-display text-text"
          >
            Tools
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            Quizzes that match you to the right gear, and comparison tables that
            put specs side-by-side.
          </p>
        </Stack>
      </Container>

      <Container as="section" className="pb-16">
        <div
          data-testid="tools-grid"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              data-testid={tool.testId}
              className="group flex flex-col gap-3 border border-border p-6 hover:border-border-hi hover:bg-surface-1 transition-colors"
            >
              <span className="font-serif text-h2 text-text group-hover:text-accent transition-colors">
                {tool.heading}
              </span>
              <p className="text-body text-text-2 flex-1">{tool.description}</p>
              <span className="font-mono text-small uppercase tracking-[0.08em] text-text-2 group-hover:text-text transition-colors">
                {tool.cta} →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}
