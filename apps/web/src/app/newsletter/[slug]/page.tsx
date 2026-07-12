import type { ReactElement } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  buildArticleJsonLd,
  buildBreadcrumbListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import { Container, Stack } from '@thock/ui'
import { getAllNewsletters, getNewsletterBySlug } from '@/lib/data-runtime'
import { ArticleBody } from '@/components/article/ArticleBody'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllNewsletters().map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const newsletter = getNewsletterBySlug(slug)
  if (!newsletter) return {}

  return buildMetadata({
    title: newsletter.frontmatter.title,
    description: newsletter.frontmatter.lede,
    path: `/newsletter/${slug}`,
    type: 'article',
    publishedAt: newsletter.frontmatter.publishedAt,
  })
}

/**
 * Digest detail page. Newsletters share the article MDX body
 * renderer (`ArticleBody`) but carry no tags/parts/related-articles
 * — the digest is a standalone weekly roundup, not a catalog entry.
 */
export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReactElement> {
  const { slug } = await params
  const newsletter = getNewsletterBySlug(slug)
  if (!newsletter) notFound()

  const fm = newsletter.frontmatter
  const path = `/newsletter/${slug}`

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
              author: 'thock',
            }),
            buildBreadcrumbListJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Newsletter', path: '/newsletter' },
              { name: fm.title, path },
            ]),
          ]}
        />

        <Container as="header" className="py-12 sm:py-16">
          <Stack gap={4}>
            <PageSectionKicker testId="newsletter-detail-eyebrow">
              issue {String(fm.issue).padStart(2, '0')}
            </PageSectionKicker>
            <h1
              data-testid="newsletter-detail-h1"
              className="font-serif italic text-h1 sm:text-display text-text"
            >
              {fm.title}
            </h1>
            <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-2">
              {fm.publishedAt.slice(0, 10)}
            </p>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              {fm.lede}
            </p>
          </Stack>
        </Container>

        <ArticleBody body={newsletter.body} />

        <Container as="section" className="pb-16">
          <Link
            href="/newsletter"
            data-testid="newsletter-detail-back-link"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            ← all issues
          </Link>
        </Container>
      </article>
    </main>
  )
}
