import type { ReactElement } from 'react'
import type { TrendRow } from '@thock/data'
import type { Article } from '@thock/content'
import { Container } from '@thock/ui'
import { HomeSectionHeading } from '@/components/home/HomeSectionHeading'
import { CATEGORY_LABEL, type TrendCategory } from '@/lib/tracker'
import { TrackerTable } from './TrackerTable'

export type TrackerCategorySectionProps = {
  category: TrendCategory
  rows: TrendRow[]
  articlesBySlug?: Map<string, Article>
}

/**
 * One per-category section on the tracker. Heading + table.
 * Hidden when zero rows (the heading is skipped too).
 */
export function TrackerCategorySection({
  category,
  rows,
  articlesBySlug,
}: TrackerCategorySectionProps): ReactElement | null {
  if (rows.length === 0) return null
  const label = CATEGORY_LABEL[category]

  return (
    <Container
      as="section"
      data-testid="tracker-category-section"
      data-category={category}
      className="pb-12 sm:pb-16"
    >
      <HomeSectionHeading
        kicker={label.plural}
        title={`${label.single} movers`}
      />
      <TrackerTable rows={rows} articlesBySlug={articlesBySlug} />
    </Container>
  )
}
