import { Container, Stack } from '@thock/ui'
import { getAllArticles } from '@thock/content'
import {
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
  siteConfig,
} from '@thock/seo'
import { HomeArticleList } from '@/components/home/HomeArticleList'

export const metadata = buildMetadata({
  title: siteConfig.tagline,
  description: siteConfig.description,
  path: '/',
})

/**
 * Phase 3 home — minimal article list to prove the @thock/content
 * pipeline. Phase 6 replaces this with the full home composition
 * (hero pick, trending row, latest-by-pillar, group-buys widget).
 */
export default function HomePage() {
  const articles = getAllArticles()

  return (
    <Container as="section" className="py-12 sm:py-16">
      <JsonLd graph={buildWebSiteJsonLd()} />
      <Stack gap={6}>
        <header className="flex flex-col gap-4">
          <span className="font-mono uppercase tracking-[0.1em] text-text-3 text-micro">
            phase 3 · pipeline preview
          </span>
          <h1 className="font-serif text-display text-text">{siteConfig.name}</h1>
          <p className="max-w-[60ch] text-text-2 text-h3 font-serif">
            {siteConfig.description}
          </p>
        </header>

        <div className="border-t border-border pt-2">
          <HomeArticleList articles={articles} />
        </div>
      </Stack>
    </Container>
  )
}
