import Link from 'next/link'
import type { Article } from '@thock/content'
import { getAllTags, type Tag } from '@thock/content'

const PILLAR_LABEL: Record<Article['frontmatter']['pillar'], string> = {
  news: 'News',
  trends: 'Trends',
  ideas: 'Ideas',
  'deep-dives': 'Deep Dive',
  guides: 'Guides',
}

export type HomeArticleListProps = {
  articles: Article[]
}

/**
 * Phase 3 home — minimal vertical list of articles. Phase 6
 * replaces this with the full home composition (hero pick,
 * trending, latest-by-pillar, group-buys widget). Lives in its
 * own component so the swap is mechanical.
 */
export function HomeArticleList({ articles }: HomeArticleListProps) {
  const tagsBySlug = new Map<string, Tag>(getAllTags().map((t) => [t.slug, t]))

  return (
    <ul className="divide-y divide-border" data-testid="home-article-list">
      {articles.map((article) => {
        const { frontmatter, slug, readTime } = article
        return (
          <li key={slug} className="py-6">
            <Link
              href={`/article/${slug}`}
              className="group flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-micro uppercase tracking-[0.1em] text-text-3">
                  {PILLAR_LABEL[frontmatter.pillar]}
                </span>
                <h2 className="font-serif text-h2 text-text group-hover:text-accent transition-colors">
                  {frontmatter.title}
                </h2>
                <p className="max-w-[60ch] text-text-2">{frontmatter.lede}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-small text-text-3">
                  <span>{frontmatter.author}</span>
                  <span aria-hidden="true">·</span>
                  <span>{readTime} min read</span>
                  {frontmatter.tags.slice(0, 3).map((tagSlug) => {
                    const t = tagsBySlug.get(tagSlug)
                    return (
                      <span
                        key={tagSlug}
                        className="font-mono text-micro uppercase tracking-[0.08em] text-text-3"
                      >
                        {t?.name ?? tagSlug}
                      </span>
                    )
                  })}
                </div>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
