import type { ReactElement } from 'react'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
} from '@thock/seo'
import { Container, Stack } from '@thock/ui'
import { AboutBody } from '@/components/about/AboutBody'

const PATH = '/about'
const TITLE = 'About'
const LEDE =
  'Editorial standards, voice, and how we cover the hobby. Knowledgeable peer, never breathless hype.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function AboutPage(): ReactElement {
  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildWebSiteJsonLd(),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: TITLE, path: PATH },
          ]),
        ]}
      />

      <Container as="section" className="py-12 sm:py-16">
        <Stack gap={6}>
          <div className="flex flex-col gap-3 max-w-[60ch]">
            <span
              data-testid="about-eyebrow"
              className="font-mono text-micro uppercase tracking-[0.12em] text-accent"
            >
              about
            </span>
            <h1 className="font-serif italic text-display text-text">
              who we are
            </h1>
            <p className="font-serif text-h3 text-text-2">{LEDE}</p>
          </div>

          <AboutBody />
        </Stack>
      </Container>
    </main>
  )
}
