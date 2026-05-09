import Link from 'next/link'
import { Container, Stack } from '@thock/ui'

export default function ArticleNotFound() {
  return (
    <Container as="section" className="py-24">
      <Stack gap={4}>
        <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent-mu">
          404 · article
        </span>
        <h1 className="font-serif text-h1 sm:text-display text-text">
          That article doesn&rsquo;t exist (yet).
        </h1>
        <p className="max-w-[60ch] font-serif text-h3 text-text-2">
          The slug you followed isn&rsquo;t in our archives. Either it never
          shipped, or the link is wrong.
        </p>
        <Link
          href="/"
          className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
        >
          ← back to home
        </Link>
      </Stack>
    </Container>
  )
}
