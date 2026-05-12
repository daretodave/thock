import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import { getAllTags } from '@/lib/data-runtime'
import { TagsIndex, CATEGORY_ORDER } from '@/components/tags/TagsIndex'

const PATH = '/tags'

export const metadata = buildMetadata({
  title: 'All tags',
  description:
    'Every tag on thock, grouped by category — switch, layout, brand, material, profile, and more.',
  path: PATH,
})

export default function TagsPage(): ReactElement {
  const tags = getAllTags()

  const itemListItems = tags.map((t) => ({
    name: t.name,
    path: `/tag/${t.slug}`,
  }))

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: 'All tags',
            description: 'Every tag on thock, grouped by category.',
            path: PATH,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'All tags', path: PATH },
          ]),
          buildItemListJsonLd({
            name: 'Tags — all categories',
            items: itemListItems,
          }),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <span
            data-testid="tags-eyebrow"
            className="font-mono uppercase tracking-[0.12em] text-micro text-text-3"
          >
            browse · all tags
          </span>
          <h1
            data-testid="tags-h1"
            className="font-serif italic text-h1 sm:text-display text-text"
          >
            All tags
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            {tags.length} tags across {CATEGORY_ORDER.length} categories.
          </p>
        </Stack>
      </Container>

      <TagsIndex tags={tags} />
    </main>
  )
}
