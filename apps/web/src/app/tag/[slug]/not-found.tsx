import Link from 'next/link'
import { headers } from 'next/headers'
import { Container, Stack } from '@thock/ui'
import {
  SuggestedArticles,
  pathnameToSlug,
} from '@/components/not-found/SuggestedArticles'

export default async function TagNotFound() {
  const headerList = await headers()
  const pathname = headerList.get('x-pathname')
  const slug = pathnameToSlug(pathname)

  return (
    <main className="flex-1">
    <Container as="section" className="py-24">
      <Stack gap={6}>
        <div className="flex flex-col gap-4">
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent-mu">
            404 · tag
          </span>
          <h1 className="font-serif text-h1 sm:text-display text-text">
            No tag with that name.
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            The tag you followed isn&rsquo;t in our taxonomy.
          </p>
        </div>

        <SuggestedArticles
          slug={slug}
          eyebrow="articles touching that topic"
        />

        <Link
          href="/"
          className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
        >
          ← back to home
        </Link>
      </Stack>
    </Container>
    </main>
  )
}
