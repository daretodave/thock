import type { ReactElement } from 'react'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
} from '@thock/seo'
import { Container, Stack } from '@thock/ui'
import { countSourceTags } from '@thock/content'
import { getAllArticles } from '@/lib/data-runtime'
import {
  SourceCounts,
  type ArticleSourceCount,
} from '@/components/sources/SourceCounts'

const PATH = '/sources'
const TITLE = 'Sources'
const LEDE =
  'Citations and references collected from every article. Honesty about where we got the facts.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function SourcesPage(): ReactElement {
  const articles = getAllArticles()
  const rows: ArticleSourceCount[] = articles.map((article) => ({
    article,
    sourceCount: countSourceTags(article.body),
  }))

  return (
    <>
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
              data-testid="sources-eyebrow"
              className="font-mono text-micro uppercase tracking-[0.12em] text-accent-mu"
            >
              sources
            </span>
            <h1 className="font-serif italic text-display text-text">
              where we got the facts
            </h1>
            <p className="font-serif text-h3 text-text-2">{LEDE}</p>
          </div>

          <div className="thock-prose max-w-[60ch]">
            <p>
              thock cites external references inline as citations. Vendor
              links are auto-flagged with{' '}
              <code>rel=&quot;sponsored&quot;</code> so a reader can audit
              which articles do their homework. The full per-citation index —
              article, quote, URL — is the next step; today this page lists
              the per-article tally.
            </p>
          </div>

          <SourceCounts rows={rows} />
        </Stack>
      </Container>
    </>
  )
}
