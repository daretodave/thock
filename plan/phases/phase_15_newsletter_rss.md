# Phase 15 — Newsletter signup + RSS finalize

> Agent-facing brief. Concise, opinionated, decisive. Replaces the
> phase-6 inert footer form with a Buttondown embed, replaces the
> `/newsletter` PageStub with a real page, wires Google Tag Manager
> into the root layout, and ships RSS schema validation tests for
> the per-pillar feeds. Locked snippets are embedded verbatim per
> the user's `/oversight` 2026-05-09 brief.

## Routes (locked in `plan/bearings.md`)

- `/newsletter` — replace the phase 4 PageStub with a real page.

No new routes; per-pillar RSS routes (`/feed/<pillar>.xml`) and
the global `/feed.xml` route already shipped in phase 4. This
phase finalizes them via schema-validation tests, no code change
to the route handlers themselves.

## Locked snippets — embed verbatim, theme via Tailwind only

**Buttondown form** (used in the footer + on `/newsletter`):

```html
<form
  action="https://buttondown.com/api/emails/embed-subscribe/thock"
  method="post"
  class="embeddable-buttondown-form"
>
  <label for="bd-email">Enter your email</label>
  <input type="email" name="email" id="bd-email" />
  <input type="submit" value="Subscribe" />
  <p>
    <a href="https://buttondown.com/refer/thock" target="_blank">
      Powered by Buttondown.
    </a>
  </p>
</form>
```

- Buttondown handle is `thock` (lowercase wordmark — preserve verbatim; the user corrected `thok` → `thock` twice this morning, see `384bb0a` and `e270ced`).
- Do **not** mutate the form's `action`, `method`, input `name`, or `id` attributes. Theme via Tailwind utility classes inside a thin wrapper component.
- Show "Powered by Buttondown" attribution; small mono link in the same accent color as the rest of the secondary chrome.

**Google Tag Manager** (embed in `apps/web/src/app/layout.tsx`):

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-58T839ZD');</script>
<!-- End Google Tag Manager -->
```

- Container ID is `GTM-58T839ZD`. Wire via Next's `<Script>` component with `strategy="afterInteractive"` to keep core vitals clean. Drop into the root `layout.tsx` near the top of `<body>` per Next/GTM convention.
- No consent gate yet — thock collects no PII; GTM is page-level pageview tracking only.
- Add a `// per /oversight 2026-05-09 — GTM container locked` comment so the next loop tick doesn't re-litigate.

## Sections of `/newsletter` (top → bottom)

1. **Header** — eyebrow `newsletter`, italic display H1 `join the newsletter`, lede paragraph (locked below).
2. **Form** — `<ButtondownForm variant="full">` rendered inside a max-width card on the dark surface. Theme: input field full-width on mobile, side-by-side on `md:`, brass-accent submit button. Same component the footer reuses (`variant="footer"`).
3. **Archive** — `<NewsletterArchive>` reads `apps/web/src/content/newsletters/*.mdx` via a new `getAllNewsletters()` helper in `@thock/content`. If empty (ship-15 default — no digests authored yet), render the empty state: "No digests yet — the first issue lands soon. Subscribe above to get it."

No "past issues link to external Buttondown archive" — `/newsletter` is the only archive URL until phase 16 polish.

## Components

New under `apps/web/src/components/newsletter/`:

- `ButtondownForm.tsx` (client component) — wraps the locked embed, accepts a `variant: 'footer' | 'full'` prop, applies Tailwind classes only. Inputs keep their locked attributes.
- `NewsletterArchive.tsx` (server component) — renders past digests as `<ArticleCard variant="row">`-shaped rows or the empty state.
- `__tests__/ButtondownForm.test.tsx` — assert the form's `action`, `method`, input `name`/`id`, submit value, and the "Powered by Buttondown" attribution all render verbatim.
- `__tests__/NewsletterArchive.test.tsx` — empty state copy + populated state with 2 fixture digests.

New under `apps/web/src/components/analytics/`:

- `GoogleTagManager.tsx` (client component, uses `next/script`) — renders the locked GTM snippet via `<Script id="gtm-loader" strategy="afterInteractive">{...}</Script>`. Comment cites the /oversight lock.
- `__tests__/GoogleTagManager.test.tsx` — assert the GTM container ID and `strategy="afterInteractive"` are present.

New under `packages/content/src/loaders/`:

- `newsletters.ts` — `getAllNewsletters()`, sorted by `publishedAt` desc. Frontmatter: `slug`, `title`, `lede`, `publishedAt`, `issue` (number). Empty-tolerant — returns `[]` if no MDX files exist.
- New schema in `packages/content/src/schema/newsletter.ts`.
- `__tests__/loaders/newsletters.test.ts` — empty-folder case + 2-fixture case.

Existing primitives reused:

- `<Container>`, `<Stack>`, `<Wordmark>` from `packages/ui/`.
- `<HomeSectionHeading>` from `apps/web/src/components/home/`.
- `<JsonLd>`, `buildMetadata`, `buildBreadcrumbListJsonLd`, `buildWebSiteJsonLd` from `@thock/seo`.

## RSS finalize

- New helper in `apps/web/src/lib/rss/` (or `packages/seo/`): `validateRssXml(xml: string): void` that uses a minimal handwritten validator (no new dependency — RSS 2.0 spec is small) checking required elements (`channel`, `title`, `link`, `description`, ≥1 `item`, each item with `title`, `link`, `pubDate`).
- Tests in `apps/web/src/app/feed/__tests__/feed.test.ts` (or e2e): for each pillar (`news`, `trends`, `ideas`, `deep-dives`, `guides`), fetch `/feed/<pillar>.xml`, validate against the schema. Plus the global `/feed.xml`.

## SEO

`/newsletter`:
- `generateMetadata` — title `Newsletter`, description = the locked lede.
- JSON-LD: `WebSite` + `BreadcrumbList` (matching the existing stub's shape — preserve to avoid regression).

No new sitemap row — `/newsletter` is already in `apps/web/src/app/sitemap.ts` from phase 4.

## Footer change

Replace the inert form (lines 24-51 of `apps/web/src/components/ui/Footer.tsx`) with `<ButtondownForm variant="footer" />`. The `aria-label="Newsletter signup placeholder"` aria-label string is removed (this also addresses the [LOW] critique-pass-2 finding "newsletter form labeled placeholder" without piling onto the iterate queue).

## Cross-links

- **In (verify):** Header / Footer "Newsletter" link points to `/newsletter` (already in place from phase 1 / 4).
- **Out (ship):** Footer form's `<a href="https://buttondown.com/refer/thock">` attribution; the `/newsletter` page links to `/feed.xml` for "prefer RSS?" copy in the empty-state.
- **Retro-fit:** the inert footer form. Single component swap; no whole-page restructure.

## Decisions made upfront — DO NOT ASK

1. **Buttondown handle is `thock`.** Two oversight commits today corrected the handle (`384bb0a` thok→thock, `e270ced` throc→thock). Final value `thock` matches the lowercase wordmark.
2. **GTM container `GTM-58T839ZD` ships unconditionally** — no consent banner. thock collects no PII; pageview tracking is page-level only. If forms beyond Buttondown ship later, revisit.
3. **`<Script strategy="afterInteractive">`** is the wiring. Not `beforeInteractive` (would block render) and not `lazyOnload` (would lose first-page visits). After-interactive matches the locked "keep core vitals clean" directive.
4. **Buttondown attribution is preserved verbatim** — both the form's link and the visible "Powered by Buttondown." text. Buttondown's terms require it on free-tier embeds.
5. **`<form action>` does an HTTP POST out to Buttondown** — no Next.js route handler, no validation server-side, no API key. The Buttondown URL handles the redirect to a "Subscribed" confirmation page on their domain. We do not intercept.
6. **Newsletter archive is empty at ship-15.** No digests have been authored. Ship the empty state; the next /iterate tick or a content-curator pass adds issues. The `getAllNewsletters()` loader is empty-tolerant by design.
7. **No newsletters/ MDX files seeded this phase.** Empty state ships; first digest is editorial work, not phase 15 scope.
8. **RSS schema validator is handwritten, not a new dep.** RSS 2.0 has 7 required elements; vendoring a validator package is overkill. The validator is ~30 lines + tests.
9. **`/newsletter` keeps `WebSite` + `BreadcrumbList` JSON-LD.** Same shape as the existing stub. No `Article` JSON-LD (the page is not an article).
10. **Footer form replacement also drops the `aria-label="Newsletter signup placeholder"`** — addresses the [LOW] critique-pass-2 finding (commit e270ced) inline, since the same component is being replaced anyway. Mark the critique row [x] in the same commit.
11. **GTM script lives in the root layout, not on per-page wrappers.** One pageview-tracker for the whole site. No route-level opt-out.

## Mobile reflow

- `/newsletter` form: input field full-width on mobile with submit button stacked beneath (vertical), side-by-side on `md:` (horizontal).
- Footer form: same — `flex-col` mobile, `flex-row` `md:`. The existing footer layout is already responsive; the new component slots in.
- Archive: rows stack regardless of viewport.

## Empty / loading / error states — copy locked

- `<NewsletterArchive>` empty state: 
  > "No digests yet — the first issue lands soon. Subscribe above, and I'll send you the first one when it ships."
- ButtondownForm has no loading state — it's a native HTML form POST that navigates to Buttondown's confirmation page. No JS-driven submit-in-progress UI.
- ButtondownForm has no error state at submit-time — Buttondown's domain handles error display.

## Pages × tests matrix

| Surface | Unit | E2E | Notes |
|---|---|---|---|
| `<ButtondownForm>` | ✓ (verbatim attrs check) | rendered via /newsletter + footer | locked-snippet contract |
| `<GoogleTagManager>` | ✓ (container ID + strategy) | DOM-level: `[id="gtm-loader"]` present on every page | one component, every page |
| `<NewsletterArchive>` | ✓ (empty + populated) | empty-state copy on /newsletter | empty by default at ship-15 |
| `getAllNewsletters()` | ✓ (empty + 2-fixture) | n/a | loader-level |
| /newsletter page | n/a | renders form + empty archive + JSON-LD | replaces PageStub |
| /feed.xml | n/a | RSS schema validates | global |
| /feed/<pillar>.xml × 5 | n/a | RSS schema validates | per pillar |
| Footer | n/a | form's locked action attr | retrofit |
| Layout | n/a | GTM script present in `<head>` or top-of-body | every route |

## Verify gate

`pnpm verify` must run clean: typecheck + unit + data:validate + build + e2e. The known PageStub `#418` hydration transient (`plan/AUDIT.md`) may flake; CI-equivalent `--retries=2` clears it. Phase 16 polish replaces the remaining PageStubs and self-resolves that finding.

## Commit body template

```
feat: newsletter signup + GTM + RSS validation — phase 15

- /newsletter: replace PageStub with Buttondown embed + empty archive.
- Footer: inert form replaced with <ButtondownForm variant="footer">.
- Root layout: GoogleTagManager wired with Next <Script strategy="afterInteractive">.
- Per-pillar + global RSS feeds gated by a handwritten RSS 2.0 validator + 6 e2e tests.
- @thock/content: new newsletter loader + schema; empty-tolerant.

Decisions:
- Buttondown handle locked to "thock" (two prior oversight corrections, 384bb0a + e270ced).
- GTM container locked to GTM-58T839ZD. afterInteractive strategy.
- No consent gate (no PII collected).
- Newsletter archive ships empty; first digest is editorial work, post-phase-15.
- Drained CRITIQUE pass-2 [LOW] "newsletter signup placeholder" inline — same component being replaced.
```

## DoD

- [x] `/newsletter` PageStub gone; real page renders with form + archive + JSON-LD.
- [x] Footer inert form gone; ButtondownForm wrapper in place.
- [x] GTM script present on every route via root layout.
- [x] All 6 RSS feeds (`/feed.xml`, `/feed/{news,trends,ideas,deep-dives,guides}.xml`) pass the schema validator.
- [x] CRITIQUE pass-2 [LOW] "newsletter form labeled placeholder" → marked [x].
- [x] `pnpm verify` green; deploy READY.
- [x] Build plan ticked: phase 15 → `[x]` with the addressing commit hash.

## Follow-ups (out of scope this phase)

- First newsletter digest as `apps/web/src/content/newsletters/issue-001.mdx`. Content work, not scaffolding work.
- Buttondown's "double opt-in confirmation" UX polish — depends on actual subscription flow, not code.
- Consent banner — only needed if forms beyond Buttondown ship.
- "Past issues archive" pagination — only needed once digest count > ~12.
- A `/newsletter/<issue>` per-issue route — phase 16 polish or later.
