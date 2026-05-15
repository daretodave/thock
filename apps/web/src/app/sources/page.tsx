import type { ReactElement } from 'react'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
} from '@thock/seo'
import { Container, Stack } from '@thock/ui'
import {
  countSourceTags,
  extractSourceCitations,
  type SourceCitation,
} from '@thock/content'
import { getAllArticles } from '@/lib/data-runtime'
import {
  SourceCounts,
  type ArticleSourceCount,
} from '@/components/sources/SourceCounts'
import {
  CitationIndex,
  buildCitationIndex,
} from '@/components/sources/CitationIndex'

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
  const pairs: Array<{ article: typeof articles[number]; citation: SourceCitation }> = []
  for (const article of articles) {
    for (const citation of extractSourceCitations(article.body)) {
      pairs.push({ article, citation })
    }
  }
  const citationIndex = buildCitationIndex(pairs)

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
              data-testid="sources-eyebrow"
              className="font-mono text-micro uppercase tracking-[0.12em] text-accent"
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

          <section className="flex flex-col gap-5">
            <h2
              data-testid="sources-citation-index-heading"
              className="font-mono text-micro uppercase tracking-[0.12em] text-text-2"
            >
              Citation index
            </h2>
            <p className="thock-prose max-w-[60ch] text-body text-text-2">
              Every external URL cited across thock, deduped and grouped by
              the articles that linked it.
            </p>
            <CitationIndex citations={citationIndex} />
          </section>
        </Stack>
      </Container>
    </main>
  )
}
