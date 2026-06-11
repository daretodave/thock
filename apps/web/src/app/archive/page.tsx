import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import { getAllArticles } from '@/lib/data-runtime'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'
import { groupArticlesByMonth } from '@/components/archive/archiveUtils'
import { ArchiveList } from '@/components/archive/ArchiveList'

const PATH = '/archive'

export const metadata = buildMetadata({
  title: 'Archive',
  description:
    'Every article on thock, grouped by month — browse the full history of keyboard coverage.',
  path: PATH,
})

export default function ArchivePage(): ReactElement {
  const articles = getAllArticles()
  const groups = groupArticlesByMonth(articles)

  const itemListItems = articles
    .slice(0, 50)
    .map((a) => ({ name: a.frontmatter.title, path: `/article/${a.slug}` }))

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: 'Archive',
            description: 'Every article on thock, grouped by month.',
            path: PATH,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Archive', path: PATH },
          ]),
          buildItemListJsonLd({
            name: 'Articles — full archive',
            items: itemListItems,
          }),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <PageSectionKicker testId="archive-eyebrow">
            browse · by date
          </PageSectionKicker>
          <h1
            data-testid="archive-h1"
            className="font-serif italic text-h1 sm:text-display text-text"
          >
            Archive
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            {articles.length} articles across {groups.length} month
            {groups.length !== 1 ? 's' : ''}.
          </p>
        </Stack>
      </Container>

      <ArchiveList groups={groups} />
    </main>
  )
}
