import Link from 'next/link'
import type { ReactElement } from 'react'

/**
 * /about body. Server component, locked editorial copy. Sectioned
 * by the four covered topics: what thock covers, voice, how the
 * trends scoring works, and how vendor relationships are
 * disclosed. The vendor disclosure paragraph mirrors the verbatim
 * "no affiliate arrangement" copy that already lives in the Mode
 * Sonnet R2 article — same stance, different surface.
 */
export function AboutBody(): ReactElement {
  return (
    <div
      data-testid="about-body"
      className="thock-prose flex flex-col gap-10 max-w-[60ch]"
    >
      <section data-testid="about-section-pillars">
        <h2 className="font-serif text-h2 text-text">What thock covers</h2>
        <p>
          thock is a content hub for mechanical-keyboard hobbyists who care
          about the parts, the builds, and the trade-offs. Five pillars cover
          the beat:
        </p>
        <ul>
          <li>
            <Link href="/news" className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-hi hover:decoration-accent">
              News
            </Link>{' '}
            — what&apos;s shipping, vendor moves, the broader industry signal.
          </li>
          <li>
            <Link href="/trends" className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-hi hover:decoration-accent">
              Trends
            </Link>{' '}
            — how taste in switches, layouts, and keycaps moves week-to-week,
            anchored by the{' '}
            <Link
              href="/trends/tracker"
              className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-hi hover:decoration-accent"
            >
              Trends Tracker
            </Link>{' '}
            dashboard.
          </li>
          <li>
            <Link href="/ideas" className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-hi hover:decoration-accent">
              Ideas &amp; Builds
            </Link>{' '}
            — hands-on builds, mods, and the half-formed ideas that turn into
            hobbies.
          </li>
          <li>
            <Link
              href="/deep-dives"
              className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-hi hover:decoration-accent"
            >
              Deep Dives
            </Link>{' '}
            — long-form, sourced, and unhurried.
          </li>
          <li>
            <Link href="/guides" className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-hi hover:decoration-accent">
              Guides
            </Link>{' '}
            — practical reference: firmware, modding, switches, keycaps.
          </li>
        </ul>
      </section>

      <section data-testid="about-section-voice">
        <h2 className="font-serif text-h2 text-text">Voice</h2>
        <p>
          thock is written like a knowledgeable peer, not a hype-bro. The
          wordmark is lowercase on purpose. Technical terms (switch names,
          firmware identifiers, profile codes, SKUs) wrap in mono so they
          stand out from the prose without shouting. Headlines lean italic in
          Newsreader; body type is IBM Plex Sans. The single restrained accent
          is warm brass / aged bronze, used for the wordmark dot, the last 72
          hours of a group buy, and hover affordances — never decoration.
        </p>
      </section>

      <section data-testid="about-section-trends">
        <h2 className="font-serif text-h2 text-text">How trends scoring works</h2>
        <p>
          The{' '}
          <Link
            href="/trends/tracker"
            className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-hi hover:decoration-accent"
          >
            Trends Tracker
          </Link>{' '}
          scores switches, keycaps, layouts, vendors, and brands on a single
          &minus;100 to 100 scale, updated weekly. The score is a weighted
          blend of community chatter, retail availability, and editorial
          mentions — direction matters more than absolute magnitude. Row
          names link to the deep dive that earned them, when one has been
          published. Empty cells are honest about where coverage hasn&apos;t
          caught up yet.
        </p>
        <p>
          Read the{' '}
          <Link
            href="/article/trends-tracker-preview"
            className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-hi hover:decoration-accent"
          >
            Trends Tracker preview
          </Link>{' '}
          for the full methodology.
        </p>
      </section>

      <section data-testid="about-section-disclosure">
        <h2 className="font-serif text-h2 text-text">Vendor relationships</h2>
        <p>
          Group-buy URLs published on thock are auto-flagged with{' '}
          <code>rel=&quot;sponsored noopener&quot;</code> at render time. That
          tag is applied by the site, not the editorial team, and applies
          whether or not thock has any commercial relationship with the
          vendor in question. We do not currently have affiliate arrangements
          with any vendor we cover. If that ever changes, the disclosure
          updates here first.
        </p>
        <p>
          Citations across articles surface on the{' '}
          <Link href="/sources" className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-accent-hi hover:decoration-accent">
            Sources
          </Link>{' '}
          page so the reader can audit where the facts came from.
        </p>
      </section>
    </div>
  )
}
