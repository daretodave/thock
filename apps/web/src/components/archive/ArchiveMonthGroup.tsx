import type { ReactElement } from 'react'
import Link from 'next/link'
import type { MonthGroup } from './archiveUtils'

type ArchiveMonthGroupProps = {
  group: MonthGroup
}

const PILLAR_LABELS: Record<string, string> = {
  news: 'News',
  trends: 'Trends',
  ideas: 'Ideas',
  'deep-dives': 'Deep Dives',
  guides: 'Guides',
}

export function ArchiveMonthGroup({
  group,
}: ArchiveMonthGroupProps): ReactElement {
  return (
    <section
      data-testid={`archive-month-group-${group.key}`}
      className="pb-10"
    >
      <div className="flex items-baseline gap-3 mb-4 border-b border-border pb-3">
        <h2
          data-testid="archive-month-heading"
          className="font-serif italic text-h2 text-text"
        >
          {group.label}
        </h2>
        <span className="font-mono text-small text-text-2">
          {group.articles.length}
        </span>
      </div>
      <ol className="flex flex-col gap-3">
        {group.articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/article/${article.slug}`}
              data-testid="archive-article-link"
              className="group flex items-baseline gap-3 hover:text-accent transition-colors"
            >
              <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3 w-20 shrink-0 group-hover:text-text-2 transition-colors">
                {PILLAR_LABELS[article.frontmatter.pillar] ?? article.frontmatter.pillar}
              </span>
              <span className="font-serif text-body text-text group-hover:text-accent transition-colors">
                {article.frontmatter.title}
              </span>
              <span className="font-mono text-micro text-text-3 shrink-0 ml-auto">
                {article.readTime}m
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
