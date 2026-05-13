import { Container, Stack } from '@thock/ui'

export type PageStubProps = {
  /** Mono uppercase kicker line above the H1. Optional. */
  eyebrow?: string
  /** Main page heading. Lower-case in copy by site convention. */
  title: string
  /** Lede paragraph under the H1. */
  lede: string
  /** "Lands in phase N" tail line. Optional. */
  deferredTo?: string
  /** Extra copy block under the lede. */
  children?: React.ReactNode
}

/**
 * Shared landing-page stub used for every URL whose family hasn't
 * been built yet. Phase 4 ships nine of these; each is replaced
 * with a real page family in phases 5–17.
 */
export function PageStub({
  eyebrow,
  title,
  lede,
  deferredTo,
  children,
}: PageStubProps) {
  return (
    <Container as="section" className="py-16 sm:py-24">
      <Stack gap={5}>
        {eyebrow && (
          <span
            data-testid="page-stub-eyebrow"
            className="font-mono uppercase tracking-[0.12em] text-micro text-accent"
          >
            {eyebrow}
          </span>
        )}

        <h1 className="font-serif text-h1 sm:text-display text-text">
          {title}
        </h1>

        <p className="max-w-[60ch] font-serif text-h3 text-text-2">{lede}</p>

        {children && <div className="text-body text-text-2">{children}</div>}

        {deferredTo && (
          <span
            data-testid="page-stub-deferred"
            className="font-mono uppercase tracking-[0.08em] text-micro text-text-3"
          >
            Lands in {deferredTo}
          </span>
        )}
      </Stack>
    </Container>
  )
}
