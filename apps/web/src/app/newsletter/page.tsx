import type { ReactElement } from 'react'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
} from '@thock/seo'
import { Container, Stack } from '@thock/ui'
import { ButtondownForm } from '@/components/newsletter/ButtondownForm'
import { NewsletterArchive } from '@/components/newsletter/NewsletterArchive'
import { HomeSectionHeading } from '@/components/home/HomeSectionHeading'
import { getAllNewsletters } from '@/lib/data-runtime'

const PATH = '/newsletter'
const TITLE = 'Newsletter'
const LEDE =
  'A weekly digest of the best of thock — trends, deep dives, and the group buys you should know about.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function NewsletterPage(): ReactElement {
  const newsletters = getAllNewsletters()

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
              data-testid="newsletter-eyebrow"
              className="font-mono text-micro uppercase tracking-[0.12em] text-accent"
            >
              newsletter
            </span>
            <h1 className="font-serif italic text-display text-text">
              join the newsletter
            </h1>
            <p className="font-serif text-h3 text-text-2">{LEDE}</p>
          </div>

          <div
            data-testid="newsletter-form-card"
            className="border border-border bg-surface p-6 sm:p-8 max-w-[60ch]"
          >
            <ButtondownForm variant="full" />
          </div>
        </Stack>
      </Container>

      <Container as="section" className="pb-16">
        <Stack gap={6}>
          <HomeSectionHeading kicker="Archive" title="Past digests" />
          <NewsletterArchive newsletters={newsletters} />
        </Stack>
      </Container>
    </main>
  )
}
