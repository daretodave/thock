import type { ReactElement } from 'react'
import { Container } from '@thock/ui'

export type PartBodyProps = {
  description: string
}

export function PartBody({ description }: PartBodyProps): ReactElement {
  return (
    <Container as="section" className="pb-12">
      <p
        data-testid="part-body"
        className="max-w-[60ch] font-serif text-h3 text-text-2"
      >
        {description}
      </p>
    </Container>
  )
}
