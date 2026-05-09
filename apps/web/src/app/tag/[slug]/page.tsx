import { notFound } from 'next/navigation'
import { Container, Stack } from '@thock/ui'
import { getArticlesByTag, getTagBySlug } from '@/lib/data-runtime'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tag = getTagBySlug(slug)
  if (!tag) return {}

  const description = `Every thock article tagged #${tag.slug}. Category: ${tag.category}.`
  return buildMetadata({
    title: `#${tag.slug}`,
    description,
    path: `/tag/${tag.slug}`,
  })
}

/**
 * Phase 4 stub — confirms the tag exists in `tags.json` and renders
 * a placeholder. Phase 12 ships the full tag-pages family with the
 * article list and clickable `<TagChip>` cross-link retrofit.
 */
export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tag = getTagBySlug(slug)
  if (!tag) notFound()

  const articles = getArticlesByTag(tag.slug)
  const path = `/tag/${tag.slug}`

  return (
    <Container as="section" className="py-12 sm:py-16">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: `#${tag.slug}`,
            description: `Articles tagged ${tag.slug}.`,
            path,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: `#${tag.slug}`, path },
          ]),
        ]}
      />
      <Stack gap={4}>
        <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent-mu">
          tag · {tag.category}
        </span>
        <h1 className="font-serif text-h1 sm:text-display text-text">
          #{tag.slug}
        </h1>
        <p className="max-w-[60ch] font-serif text-h3 text-text-2">
          {tag.name}
        </p>
        <div className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          {articles.length}{' '}
          {articles.length === 1 ? 'article' : 'articles'} · full index lands
          phase 12
        </div>
      </Stack>
    </Container>
  )
}
