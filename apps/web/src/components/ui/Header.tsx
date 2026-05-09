import Link from 'next/link'
import { Container, Wordmark } from '@thock/ui'
import { PILLARS } from '@thock/seo'

export function Header() {
  return (
    <header className="border-b border-border bg-bg">
      <Container as="div" className="flex items-center justify-between gap-6 py-4">
        <Link href="/" aria-label="thock — home" className="shrink-0">
          <Wordmark size="md" />
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.slug}
              href={pillar.href}
              className="font-sans text-small text-text-2 hover:text-text transition-colors"
            >
              {pillar.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-9 w-9 items-center justify-center border border-border text-text-3 hover:text-text hover:border-border-hi transition-colors"
            disabled
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </div>
      </Container>
    </header>
  )
}
