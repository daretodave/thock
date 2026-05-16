import type { ReactElement } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import type { Tag } from '@thock/content'
import {
  getAllTags,
  getArticlesByTag,
  getTagBySlug,
} from '@/lib/data-runtime'
import { ArticleCard } from '@/components/home/ArticleCard'
import { HomeSectionHeading } from '@/components/home/HomeSectionHeading'
import { sortArticlesForTagArchive } from '@/components/pillar/PillarArchiveList'

const CATEGORY_TINT: Record<Tag['category'], string> = {
  switch: 'text-tag-switch',
  layout: 'text-tag-layout',
  brand: 'text-tag-brand',
  material: 'text-tag-material',
  profile: 'text-tag-profile',
  misc: 'text-text-2',
}

const CATEGORY_LABEL: Record<Tag['category'], string> = {
  switch: 'switch',
  layout: 'layout',
  brand: 'brand',
  material: 'material',
  profile: 'profile',
  misc: 'topic',
}

function describeTag(tag: Tag, count: number): string {
  const noun = count === 1 ? 'piece' : 'pieces'
  return `Articles tagged ${tag.name} on thock — ${count} ${noun}.`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tag = getTagBySlug(slug)
  if (!tag) return {}
  const count = getArticlesByTag(tag.slug).length
  return buildMetadata({
    title: `#${tag.slug}`,
    description: describeTag(tag, count),
    path: `/tag/${tag.slug}`,
  })
}

/**
 * Phase 12 — canonical tag page. Categorical-tinted header +
 * chronological article list. No hero. The list is the page;
 * the categorical tint and the count are the personality.
 */
export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReactElement> {
  const { slug } = await params
  const tag = getTagBySlug(slug)
  if (!tag) notFound()

  const articles = sortArticlesForTagArchive(getArticlesByTag(tag.slug), tag)
  const path = `/tag/${tag.slug}`
  const allTags = getAllTags()
  const tagsBySlug = new Map<string, Tag>(allTags.map((t) => [t.slug, t]))
  const tint = CATEGORY_TINT[tag.category] ?? CATEGORY_TINT.misc

  const itemListItems = articles.map((a) => ({
    name: a.frontmatter.title,
    path: `/article/${a.slug}`,
  }))

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: `#${tag.slug}`,
            description: describeTag(tag, articles.length),
            path,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: `#${tag.slug}`, path },
          ]),
          buildItemListJsonLd({
            name: `#${tag.slug} — articles`,
            items: itemListItems,
          }),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <span
            data-testid="tag-page-eyebrow"
            className={`font-mono uppercase tracking-[0.12em] text-micro ${tint}`}
          >
            tag · {CATEGORY_LABEL[tag.category]}
          </span>
          <h1
            data-testid="tag-page-h1"
            className="font-serif italic text-h1 sm:text-display text-text"
          >
            #{tag.slug}
          </h1>
          <p
            data-testid="tag-page-lede"
            className="max-w-[60ch] font-serif text-h3 text-text-2"
          >
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}{' '}
            tagged #{tag.slug}.
          </p>
          <Link
            href="/tags"
            data-testid="tag-page-back-link"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            ← all tags
          </Link>
        </Stack>
      </Container>

      {articles.length > 0 ? (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading
            kicker="Latest first"
            title={`Every #${tag.slug} piece`}
          />
          <div data-testid="tag-archive-list" className="flex flex-col">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                variant="row"
                tagsBySlug={tagsBySlug}
              />
            ))}
          </div>
        </Container>
      ) : (
        <Container as="section" className="pb-16">
          <Stack gap={4}>
            <span data-testid="page-section-kicker" className="font-mono uppercase tracking-[0.12em] text-micro text-text-2">
              empty tag
            </span>
            <h2 className="font-serif text-h2 text-text">
              No articles tagged #{tag.slug} yet.
            </h2>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              When something lands under this tag, it shows up here first.
            </p>
          </Stack>
        </Container>
      )}
    </main>
  )
}
