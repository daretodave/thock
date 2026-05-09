import { notFound } from 'next/navigation'
import { Container, Stack } from '@thock/ui'
import { getArticleBySlug } from '@thock/content'
import {
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildMetadata,
  JsonLd,
  pillarLabel,
  pillarHref,
} from '@thock/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}

  return buildMetadata({
    title: article.frontmatter.title,
    description: article.frontmatter.lede,
    path: `/article/${article.slug}`,
    type: 'article',
    publishedAt: article.frontmatter.publishedAt,
    updatedAt: article.frontmatter.updatedAt ?? undefined,
    author: article.frontmatter.author,
    ...(article.frontmatter.heroImage
      ? { ogImage: article.frontmatter.heroImage }
      : {}),
  })
}

/**
 * Phase 4 stub — minimal article page so the URL exists, the
 * canonical link tag is correct, and the JSON-LD `Article` graph is
 * already valid. Phase 5 ships the canonical template (hero, body
 * MDX, tag rail, related-articles rail, mentioned-parts rail).
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
  const pillar = fm.pillar
  const path = `/article/${article.slug}`

  return (
    <Container as="article" className="py-12 sm:py-16">
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
            { name: pillarLabel(pillar), path: pillarHref(pillar) },
            { name: fm.title, path },
          ]),
        ]}
      />
      <Stack gap={5}>
        <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent-mu">
          <a href={pillarHref(pillar)} className="hover:text-accent">
            {pillarLabel(pillar)}
          </a>
        </span>
        <h1 className="font-serif text-h1 sm:text-display text-text">
          {fm.title}
        </h1>
        <p className="max-w-[60ch] font-serif text-h3 text-text-2">{fm.lede}</p>
        <div className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          {fm.author} · {article.readTime} min read · phase 4 stub —
          canonical template ships in phase 5
        </div>
      </Stack>
    </Container>
  )
}
