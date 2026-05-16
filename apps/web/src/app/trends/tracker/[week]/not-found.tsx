import Link from 'next/link'
import { Container, Stack } from '@thock/ui'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

export default function TrackerWeekNotFound() {
  return (
    <main id="main" className="flex-1">
      <Container as="section" className="py-24">
        <Stack gap={4}>
          <PageSectionKicker>404 · tracker</PageSectionKicker>
          <h1 className="font-serif text-h1 sm:text-display text-text">
            Week not found.
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            That snapshot hasn&apos;t been published yet, or the week identifier
            is malformed. Valid format is{' '}
            <span className="font-mono text-mono text-text">YYYY-WNN</span>.
          </p>
          <Link
            href="/trends/tracker"
            className="font-mono text-small uppercase tracking-[0.08em] text-accent hover:text-accent-hi"
          >
            ← Back to latest tracker
          </Link>
        </Stack>
      </Container>
    </main>
  )
}
