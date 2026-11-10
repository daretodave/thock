# 08 — OG image render-verification gate

> Render every `opengraph-image.tsx` handler through the real
> Satori/`next/og` pipeline during the hermetic e2e leg and
> decode the resulting PNG, so a silent 0-byte or near-blank OG
> image never again ships past the verify gate undetected.

## Why

`plan/AUDIT.md` carries 15 closed `[seo]` findings with "OG" in
the title going back to phase 16 — missing coverage on 6+54+39
routes, a per-week-identical tracker OG image, a newsletter OG
card showing "Issue 03" instead of the real title, a
compare/board OG tagline citing a nonexistent field, OG cards
degrading past 72-char titles, and (per this file's own code
comment in `apps/web/src/app/opengraph-image.tsx`) an earlier
defect where `oklch()` colors made Satori emit "0-byte PNGs that
Vercel cached for a year" — a completely silent, maximally severe
instance of the same root gap. Two more instances shipped in one
~4-hour same-session window: `59de1dd0` shipped length-tiered
headline font sizing for long names; `2012516f`/`68041b9a` then
found the fix's own 84px tier still wrapped a 26-char name in the
real Satori renderer. Separately `c04fc151`/`5ec02b27` fixed OG
images silently falling back to Noto Sans instead of their
declared fonts; `1e5617ad` then found that fix's 500-weight font
variants pushed the edge function payload over Vercel's 1MB
limit. All four shipped with a passing `pnpm verify`.

No existing mechanism covers this class. `og-coverage-check.mjs`
only checks that an `opengraph-image.tsx` file exists per route
(file presence, not render correctness).
`apps/web/src/components/og/__tests__/{PillarOG,ArticleOG}.test.tsx`
render the content components through `@testing-library/react`
in jsdom — real DOM/CSS, not the Satori WASM layout engine
`next/og`'s `ImageResponse` actually uses at request time (its
own font-loading, CSS subset, and flexbox-only layout quirks).
Every one of the 15 historical defects and both of this session's
follow-up bugs is exactly the class of thing jsdom cannot catch
because it never invokes `ImageResponse`. Candidate `[6.5]`
(proposed 2026-08-08, expand pass 298, 92 days old),
auto-promoted (aged) `/march` depth promotion, veto #<ISSUE>.

## Design

- New Playwright spec `apps/e2e/tests/og-render-check.spec.ts`,
  running inside the existing hermetic e2e leg (`next start` on
  `:4173`, no external network) rather than a second build or a
  standalone script — the production server booted for
  `smoke.spec.ts` is already serving real Satori-rendered PNGs.
- Derive the route list from
  `apps/e2e/src/fixtures/canonical-urls.ts` (`kind: 'html'`
  rows) filtered to those with a sibling `opengraph-image.tsx`
  in `apps/web/src/app` (same enumeration logic as
  `og-coverage-check.mjs`, reused rather than re-derived).
- For each route, fetch the OG image via
  `request.get('<path>/opengraph-image')` (static handlers) or
  `'<path>/opengraph-image/og'` (routes with
  `generateImageMetadata`, id `'og'` — confirmed shape from the
  newsletter JSON-LD assertion in
  `apps/e2e/tests/newsletter.spec.ts`). Read the response body as
  a `Buffer`.
- Assert, per route:
  1. `content-type` is `image/png`.
  2. The PNG's `IHDR` chunk (fixed offset: bytes 16–19 width,
     20–23 height, big-endian uint32 — no decoder dependency
     needed) reports exactly `1200×630`.
  3. The byte length clears a floor (determined empirically from
     a healthy card, expected several KB — catches both the
     historical 0-byte oklch failure and a near-blank/solid-fill
     degenerate render, since a flat-color PNG compresses to a
     tiny fraction of a text+gradient card's size). No PNG
     decoder dependency added — raw byte-length is the "lightweight
     content signal," not per-pixel sampling.
- Runs for every route in the same `pnpm e2e` pass that already
  boots `:4173` — no new `pnpm verify` leg, no new dependency, no
  schema/component/URL-contract change.

### Decisions made upfront (do not ask)

- Byte-size floor over true pixel-variance sampling: avoids
  adding a PNG-decoding dependency (`sharp`/`pngjs`) for a check
  whose two historical failure modes (0-byte, near-blank) are
  both already distinguishable by compressed size.
- Lives in the e2e leg, not a new standalone script or `pnpm
  verify` leg — the production server is already up for
  `smoke.spec.ts`; a second boot or a second build would
  duplicate cost the candidate itself flagged as a placement
  concern.
- Covers `opengraph-image.tsx` only. No `twitter-image.tsx`
  handlers exist in the repo today — out of scope until one
  ships.
- Best-effort route derivation: any route whose OG URL 404s
  (e.g. a metadata-route id convention that doesn't resolve the
  way `newsletter.spec.ts` assumes) fails that one assertion,
  not the whole file — each route is its own `test()`.

## Acceptance

- **A1** `apps/e2e/tests/og-render-check.spec.ts` exists and
  runs as part of `pnpm e2e`, fetching the real rendered PNG for
  every canonical HTML route that has an `opengraph-image.tsx`
  handler.
- **A2** Each fetched response asserts `content-type: image/png`,
  `IHDR` width/height exactly `1200×630`, and a byte-size floor.
- **A3** The test suite fails (not silently passes) if a route's
  OG handler returns a 0-byte or otherwise undersized PNG —
  verified by a fixture/mock case that reproduces the historical
  oklch 0-byte failure shape.
- **A4** The route list is derived from
  `canonical-urls.ts` + the same route-enumeration logic as
  `og-coverage-check.mjs`, not a hand-maintained duplicate list,
  so a new route with an OG handler is covered automatically.
- **A5** No new `pnpm verify` leg, no new runtime dependency, no
  schema/component/URL-contract change.

## Open questions

None.

## Chunks

Measure: 5 open · 0 closed · next A6

- [ ] **08.1** Core test file: route derivation, PNG fetch, content-type + IHDR + byte-floor assertions · M · closes A1, A2, A4, A5 · needs —
  - New `apps/e2e/tests/og-render-check.spec.ts`, added to the
    existing hermetic e2e leg (no new `pnpm verify` leg, no new
    runtime dependency — A5).
  - Route derivation: import the canonical HTML routes from
    `apps/e2e/src/fixtures/canonical-urls.ts` (`kind: 'html'`
    rows), then filter to those with a sibling
    `opengraph-image.tsx` under `apps/web/src/app` — reuse
    `og-coverage-check.mjs`'s route-enumeration approach (walk
    `apps/web/src/app`, map each `page.tsx` directory to its
    App Router path, excluding the same non-route segments:
    `api`, `_components`, `_lib`, `_hooks`) rather than
    re-deriving a second list (A4). Since
    `og-coverage-check.mjs` is a standalone script (not an
    importable module), extract its directory-to-path mapping
    logic into the spec file directly, keeping the exact same
    exclusion set and walk order so the two enumerations can't
    drift silently — a comment cross-references the script.
  - Per route, resolve the OG fetch path:
    `opengraph-image.tsx` files using `generateImageMetadata`
    (`grep -rl generateImageMetadata apps/web/src/app` —
    newsletter, part, part/[kind]/[slug], article, vendor, tag,
    trends/tracker/[week]) fetch `<path>/opengraph-image/og`;
    every other `opengraph-image.tsx` fetches
    `<path>/opengraph-image` directly (same shape confirmed by
    `apps/e2e/tests/newsletter.spec.ts`'s JSON-LD image-URL
    assertion). Hard-code which routes are
    `generateImageMetadata`-based as a small set literal next to
    the route derivation (the set is the file list above, not
    expected to churn independent of this review).
  - One Playwright `test()` per route (A3's "fails that one
    assertion, not the whole file" shape), each doing:
    `request.get('<resolved-path>')`, then on the raw response:
    1. `content-type` header is exactly `image/png`.
    2. Read the body as a `Buffer`; read width from bytes
       16–19 and height from bytes 20–23 of the `IHDR` chunk
       (big-endian `readUInt32BE`, fixed PNG offset, no decoder
       dependency), assert both equal `1200`/`630`.
    3. `buffer.length` clears a floor — run the suite once
       locally against a healthy route first to read a real
       card's byte size from the test output, then hard-code a
       floor comfortably below every observed value but well
       above a few-hundred-byte flat-fill PNG (document the
       observed sizes in a comment so a future tightening pass
       has the baseline).
  - No new dependency: PNG header parsing is 8 lines of buffer
    math, not a library.
- [ ] **08.2** Fixture test proving the suite fails on a 0-byte/undersized PNG · S · closes A3 · needs 08.1
  - A dedicated `test()` in the same spec file (not a unit test
    elsewhere — this is an e2e-level regression guard) that
    feeds a synthetic degenerate PNG buffer (zero-length, and
    separately a solid-fill PNG built small enough to fall
    under 08.1's floor) through the **same assertion helper**
    08.1 uses for width/height/byte-floor, asserting the
    helper's own checks reject both — proving the real route
    tests would have caught the historical oklch 0-byte
    failure, without needing a live broken route to reproduce
    it against. Extract the assertion logic from 08.1 into a
    small local helper function (`assertOgPng(buffer,
    contentType)`) once this chunk needs to call it twice
    (against both the live fetch and the synthetic buffers),
    rather than duplicating the three checks inline a second
    time.
  - No change to `og-render-check.spec.ts`'s route coverage —
    this chunk only adds the regression-proof test and the
    shared helper extraction.
