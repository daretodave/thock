import { notFound } from 'next/navigation'
import {
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildMetadata,
  JsonLd,
  pillarHref,
  pillarLabel,
} from '@thock/seo'
import {
  getAllTags,
  getArticleBySlug,
  getReferencedParts,
  getRelatedArticles,
} from '@/lib/data-runtime'
import { ArticleHero } from '@/components/article/ArticleHero'
import { ArticleBody } from '@/components/article/ArticleBody'
import { ArticleTagRail } from '@/components/article/ArticleTagRail'
import { MentionedPartsRail } from '@/components/article/MentionedPartsRail'
import { RelatedArticlesRail } from '@/components/article/RelatedArticlesRail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  // The og:image is emitted by the colocated opengraph-image.tsx
  // route (Satori → PNG via next/og). The article's frontmatter
  // heroImage is an SVG, and social platforms (Twitter, Facebook,
  // LinkedIn, Slack, Discord) reject image/svg+xml as og:image
  // content — passing it through here previously produced the
  // missing-preview bug.
  return buildMetadata({
    title: article.frontmatter.title,
    description: article.frontmatter.lede,
    path: `/article/${article.slug}`,
    type: 'article',
    publishedAt: article.frontmatter.publishedAt,
    updatedAt: article.frontmatter.updatedAt ?? undefined,
    author: article.frontmatter.author,
  })
}

/**
 * Phase 5 — canonical article template. Hero + MDX body + tag rail
 * + mentioned-parts rail + related-articles rail. Every later
 * page-family phase mirrors this triple
 * (apps/web/src/app/<family>/, apps/web/src/components/<family>/,
 * apps/web/src/lib/<family>/).
 */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const fm = article.frontmatter
  const path = `/article/${article.slug}`

  const allTags = getAllTags()
  const tagsBySlug = new Map(allTags.map((t) => [t.slug, t]))
  const parts = getReferencedParts(article)
  const related = getRelatedArticles(article, 4)

  return (
    <main id="main" className="flex-1">
      <article>
      <JsonLd
        graph={[
          buildArticleJsonLd({
            headline: fm.title,
            description: fm.lede,
            path,
            publishedAt: fm.publishedAt,
            updatedAt: fm.updatedAt ?? undefined,
            author: fm.author,
            heroImage: fm.heroImage,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: pillarLabel(fm.pillar), path: pillarHref(fm.pillar) },
            { name: fm.title, path },
          ]),
        ]}
      />

      <ArticleHero
        pillar={fm.pillar}
        title={fm.title}
        lede={fm.lede}
        author={fm.author}
        publishedAt={fm.publishedAt}
        readTime={article.readTime}
        heroImage={fm.heroImage}
        heroImageAlt={fm.heroImageAlt}
      />

      <ArticleBody body={article.body} parts={parts} />

      <ArticleTagRail tagSlugs={fm.tags} tagsBySlug={tagsBySlug} />

      <MentionedPartsRail parts={parts} />

      <RelatedArticlesRail articles={related} />
      </article>
    </main>
  )
}
