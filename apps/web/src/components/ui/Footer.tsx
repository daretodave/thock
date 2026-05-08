import Link from 'next/link'
import { Container, Wordmark, Stack } from '@thock/ui'

const FOOTER_NAV = [
  { label: 'About', href: '/about' },
  { label: 'Sources', href: '/sources' },
  { label: 'RSS', href: '/feed.xml' },
  { label: 'Newsletter', href: '/newsletter' },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-2">
      <Container as="div" className="py-10">
        <Stack gap={6}>
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <Stack gap={3}>
              <Wordmark size="sm" />
              <p className="max-w-[40ch] text-small text-text-3">
                editorial content hub for mechanical keyboard enthusiasts.
              </p>
            </Stack>

            <form
              method="get"
              action="/newsletter"
              aria-label="Newsletter signup placeholder"
              className="flex flex-col gap-2 md:items-end"
            >
              <label
                htmlFor="footer-email"
                className="font-mono text-micro uppercase tracking-[0.08em] text-text-3"
              >
                join the newsletter
              </label>
              <div className="flex w-full max-w-sm gap-2 md:justify-end">
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="flex-1 border border-border bg-surface px-3 py-2 text-small text-text placeholder:text-text-4 focus:outline-none focus:border-border-hi"
                />
                <button
                  type="submit"
                  className="border border-border-hi px-4 py-2 font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
              © 2026 thock
            </span>
            <nav aria-label="Footer" className="flex flex-wrap gap-5">
              {FOOTER_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-small text-text-2 hover:text-text transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </Stack>
      </Container>
    </footer>
  )
}
