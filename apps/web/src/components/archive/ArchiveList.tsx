import type { ReactElement } from 'react'
import { Container } from '@thock/ui'
import type { MonthGroup } from './archiveUtils'
import { ArchiveMonthGroup } from './ArchiveMonthGroup'

type ArchiveListProps = {
  groups: MonthGroup[]
}

export function ArchiveList({ groups }: ArchiveListProps): ReactElement {
  if (groups.length === 0) {
    return (
      <Container as="section" className="pb-16">
        <p className="font-mono text-small text-text-3">
          No articles yet — check back soon.
        </p>
      </Container>
    )
  }

  return (
    <Container
      as="section"
      data-testid="archive-list"
      className="pb-16"
    >
      {groups.map((group) => (
        <ArchiveMonthGroup key={group.key} group={group} />
      ))}
    </Container>
  )
}
