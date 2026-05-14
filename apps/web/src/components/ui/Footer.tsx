import Link from 'next/link'
import { Container, Wordmark, Stack } from '@thock/ui'
import { ButtondownForm } from '@/components/newsletter/ButtondownForm'

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
              <p
                data-testid="footer-tagline"
                className="max-w-[40ch] text-small text-text-2"
              >
                editorial content hub for mechanical keyboard enthusiasts.
              </p>
            </Stack>

            <ButtondownForm variant="footer" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <span
              data-testid="footer-copyright"
              className="font-mono text-micro uppercase tracking-[0.08em] text-text-2"
            >
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
