#!/usr/bin/env node
// scripts/itemlist-jsonld-parity-check.mjs
//
// Gate script: detects routes whose `ItemList` JSON-LD `itemListElement`
// array is computed from a source expression that has drifted from the
// array actually iterated by the rendered list section. Four independent
// reactive fixes landed for this exact defect shape (ac241f7e/#862 home,
// 9ebbd294/#864 /tags, a850625d/#865 /ideas, 03a6a392/#866 /sources) before
// anything mechanically caught it — a route's JSON-LD silently diverging
// from what a reader (or Google) actually sees. See
// plan/13-itemlist-jsonld-parity-check.md.
//
// Shape mirrors og-coverage-check.mjs — a pure detection layer that gates at
// ship time and files AUDIT.md rows when called via --write.
//
// Scope, mirroring truncation-call-site-check.mjs's receiver-name heuristic
// and heading-semantics-coverage-check.mjs's curated-mapping approach (a
// per-route regex/string scan, not a full render-and-diff):
//
//   Every `ItemList` route's page layout is shaped differently (grouped by
//   month, grouped by category, pillar triage, urgency-partitioned
//   sections, ...), so this script carries a CURATED, hand-authored
//   `ROUTE_MAP` — one entry per route, seeded from all 19 files
//   `grep -rl "ItemList" apps/web/src/app` returns. Each entry tells the
//   scanner where to look for (a) the JSON-LD `items:` source expression
//   and (b) the rendered list section's source expression, as a small,
//   legible "recipe":
//
//     jsonld:   { kind: 'auto' }                    — mechanically resolve
//                                                       `buildItemListJsonLd(
//                                                       { items: ... } )`,
//                                                       following one local
//                                                       `const` hop and
//                                                       cutting at the last
//                                                       top-level `.map()`/
//                                                       `.flatMap()` to find
//                                                       the base array
//                                                       expression; or
//               { kind: 'confirm', items: [...] }    — a hand-curated list
//                                                       of `{ pattern,
//                                                       token }` anchors,
//                                                       used whenever the
//                                                       page's real
//                                                       derivation isn't a
//                                                       single chain `auto`
//                                                       can mechanically
//                                                       isolate without
//                                                       false-positive noise
//                                                       (see ROUTE_MAP
//                                                       comments below).
//     rendered: { items: [...], file? }              — same `{ pattern,
//                                                       token }` anchor list
//                                                       for the rendered
//                                                       section, optionally
//                                                       in a different file
//                                                       (one hop into a
//                                                       child component,
//                                                       per the spec's
//                                                       "follow it one
//                                                       level" allowance).
//
//   Each side resolves to an ordered list of tokens (source-identifier
//   names, not resolved URLs — the comparison is over *which source
//   expression* feeds each side, the same class of regression the four
//   precedent bugs were). A route's `aliases` map lets the curator assert
//   a hand-verified equivalence between two differently-named identifiers
//   that are known (by reading the source) to produce the same ordered
//   content — e.g. `/archive`'s rendered `groups` is `groupArticlesByMonth
//   (articles)`, which — given the manifest is already publishedAt-desc
//   sorted — flattens back to exactly `articles`' own order.
//
//   `{ skip: '<reason>' }` entries (the two `/compare/*` tools) are
//   excluded from comparison entirely: their ItemList, when present, is a
//   literal 2-item array built from the same two resolved params the
//   table renders directly as props, not via `.map()` over an array — no
//   iterated list exists on either side to diff.
//
//   If a route's confirm/auto anchors don't find what the mapping expects
//   (the file changed shape since the mapping was authored), the route is
//   reported as `unverifiable` rather than silently assumed clean *or*
//   falsely flagged — printed as a warning in every mode, but does not
//   fail the gate (a stale mapping is a "update the mapping" problem, not
//   necessarily a live parity bug). This is a known accepted tradeoff: a
//   mapping can go stale between a route edit and an extension of its
//   curated entry, same one-time-authoring-cost tradeoff
//   og-coverage-check.mjs's own route enumeration already accepts.
//
// Usage:
//   node scripts/itemlist-jsonld-parity-check.mjs
//     Gate mode: exit 1 if any route's JSON-LD/rendered order or set
//     diverges, printing every flagged route + mismatch shape.
//
//   node scripts/itemlist-jsonld-parity-check.mjs --write
//     Scan every mapped route; append seo AUDIT.md rows for flagged
//     routes. Deduplicates.
//
//   node scripts/itemlist-jsonld-parity-check.mjs --json
//     JSON output: { flagged: [...], skipped: [...], unverifiable: [...] }
//     — for programmatic use (digest's nightly run).
//
// Exit codes:
//   0 → no flagged routes (gate mode) or scan complete (--write/--json)
//   1 → flagged routes found (gate mode) or error (any mode)

import { existsSync, readFileSync, appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// ── Generic balanced-expression capture helpers ───────────────────────────────
//
// Not a full TS/JS parser (per the spec's explicitly-accepted tradeoff) —
// depth counting over bracket characters, same lazy-regex-over-raw-text
// spirit as heading-semantics-coverage-check.mjs's TAG_RE tokenizer.

const OPEN_CHARS = new Set(['(', '[', '{'])
const CLOSE_CHARS = new Set([')', ']', '}'])

/**
 * Starting at `start` (the position right after a declaration's `=`),
 * capture the statement's RHS by tracking bracket depth over `()[]{}` and
 * stopping at the first point where depth has returned to 0 and the
 * current character is a statement terminator (`;` or a newline — this
 * codebase's style omits semicolons, so a newline at depth 0 is the
 * common case) or end of input.
 */
function captureStatementExpr(content, start) {
  let depth = 0
  let i = start
  for (; i < content.length; i++) {
    const ch = content[i]
    if (depth === 0 && (ch === ';' || ch === '\n')) break
    if (OPEN_CHARS.has(ch)) depth++
    else if (CLOSE_CHARS.has(ch)) depth--
  }
  return content.slice(start, i).trim()
}

/**
 * Starting right after an opening bracket already consumed by the caller
 * (depth implicitly 1), capture up to and including the matching closing
 * bracket, returning the inner text (excluding both brackets). Returns
 * null if the brackets never balance before end of input.
 */
function captureBalancedInner(content, startAfterOpen) {
  let depth = 1
  for (let i = startAfterOpen; i < content.length; i++) {
    const ch = content[i]
    if (OPEN_CHARS.has(ch)) depth++
    else if (CLOSE_CHARS.has(ch)) {
      depth--
      if (depth === 0) return content.slice(startAfterOpen, i)
    }
  }
  return null
}

/**
 * Within `text` (not full file content), starting at `start`, capture a
 * value expression up to the first point where bracket depth has
 * returned to 0 and the current character is one of `terminators`.
 * Used to pull an object literal's `items:` value out without needing a
 * full parser — mirrors captureStatementExpr's depth-tracking but with a
 * caller-supplied terminator set instead of `;`/newline.
 */
function captureValueUntilTerminator(text, start, terminators) {
  let depth = 0
  let i = start
  for (; i < text.length; i++) {
    const ch = text[i]
    if (depth === 0 && terminators.includes(ch)) break
    if (OPEN_CHARS.has(ch)) depth++
    else if (CLOSE_CHARS.has(ch)) depth--
  }
  return text.slice(start, i).trim()
}

/**
 * Finds the LAST top-level (paren-depth-0) `.map(`/`.flatMap(` call in
 * `text` and splits there: `{ base: text before it, ok: true }`. Tracks
 * only parens (not brackets/braces) — chain links are always `.map(`/
 * `.flatMap(` calls, so paren depth alone correctly distinguishes a
 * top-level chain link from one nested inside an earlier link's own
 * callback (e.g. `groups.flatMap((g) => g.articles.map(...))` has only
 * ONE top-level call — the outer flatMap, since the inner map sits inside
 * flatMap's still-open paren — while `CATEGORY_ORDER.flatMap((cat) => ...)
 * .map((t) => ...)` has two chained top-level calls, and cutting at the
 * LAST one correctly keeps the first flatMap's full clause, including its
 * own base identifier, as part of the "base" — see ROUTE_MAP's /guides vs
 * /tags comments for which shape each route is).
 */
function splitAtLastTopLevelMap(text) {
  let depth = 0
  let lastIdx = -1
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (depth === 0 && ch === '.') {
      if (text.startsWith('.map(', i) || text.startsWith('.flatMap(', i)) {
        lastIdx = i
      }
    }
    if (ch === '(') depth++
    else if (ch === ')') depth--
  }
  if (lastIdx === -1) return null
  return { base: text.slice(0, lastIdx).trim() }
}

/** Resolves a bare local `const <varName> = <RHS>` declaration's RHS text. */
function resolveDeclaredRhs(content, varName) {
  const escaped = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`\\bconst\\s+${escaped}\\s*(?::[^=\\n]*?)?=\\s*`)
  const m = re.exec(content)
  if (!m) return null
  return captureStatementExpr(content, m.index + m[0].length)
}

// ── Tokenization ───────────────────────────────────────────────────────────────

const KEYWORD_STOPLIST = new Set([
  'true', 'false', 'null', 'undefined', 'this', 'new', 'typeof', 'void', 'in', 'of',
])

// SCREAMING_SNAKE_CASE constants (e.g. ARCHIVE_MAX, ENDED_CAP) are scalar
// caps/thresholds, not the data array itself — dropped so a cosmetic cap
// bump doesn't register as a source-identifier difference. Requires an
// underscore so single-word all-caps data arrays (e.g. `TOOLS`) survive.
const CONST_RE = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+$/

const IDENTIFIER_RE = /[A-Za-z_$][\w$]*/g

// Identifiers immediately preceded by a single `.` are property/method
// access (`.slice`, `.map`, `.get`, ...) — chain-link noise, not a
// data-source identifier. A *spread* (`...live`) is preceded by three
// dots, not one, and must survive — so this counts the run of dots
// immediately before the match rather than using a flat lookbehind.
function precededBySinglePropertyDot(text, matchIndex) {
  let dotRun = 0
  let i = matchIndex - 1
  while (i >= 0 && text[i] === '.') {
    dotRun++
    i--
  }
  return dotRun === 1
}

function tokenize(text) {
  const out = []
  for (const m of text.matchAll(IDENTIFIER_RE)) {
    if (precededBySinglePropertyDot(text, m.index)) continue
    const t = m[0]
    if (KEYWORD_STOPLIST.has(t) || CONST_RE.test(t)) continue
    out.push(t)
  }
  return out
}

/**
 * Applies the route's curated alias map (a hand-verified "these two
 * differently-named identifiers produce the same ordered content"
 * assertion) token-by-token, then collapses adjacent duplicate tokens —
 * the latter so a rendered side built from a split-then-concatenated
 * array (e.g. /group-buys' `closingSoon` + `liveOpen`, both aliased to
 * `live`) reconstructs to the same single-token run as the JSON-LD side's
 * `live` instead of staying doubled.
 */
function applyAliasesAndCollapse(tokens, aliases) {
  const mapped = tokens.map((t) => aliases[t] ?? t)
  const out = []
  for (const t of mapped) {
    if (out.length === 0 || out[out.length - 1] !== t) out.push(t)
  }
  return out
}

// ── JSON-LD `auto` extraction ───────────────────────────────────────────────────

const BUILD_CALL = 'buildItemListJsonLd('

/**
 * Mechanically resolves the `items:` source expression inside a
 * `buildItemListJsonLd({ ... })` call: finds the call, captures its
 * (balanced) argument object text, finds the `items:` key's value,
 * resolves one local `const` hop if the value is a bare identifier, then
 * cuts at the last top-level `.map()`/`.flatMap()` to isolate the base
 * array expression. Returns `{ ok: true, tokens, baseText }` or
 * `{ ok: false, reason }`.
 */
function extractJsonldAuto(content) {
  const callIdx = content.indexOf(BUILD_CALL)
  if (callIdx === -1) {
    return { ok: false, reason: `${BUILD_CALL} not found` }
  }
  const argsText = captureBalancedInner(content, callIdx + BUILD_CALL.length)
  if (argsText == null) {
    return { ok: false, reason: `unbalanced ${BUILD_CALL}...)` }
  }
  const itemsMatch = /\bitems\s*:/.exec(argsText)
  if (!itemsMatch) {
    return { ok: false, reason: 'items: not found in buildItemListJsonLd(...) args' }
  }
  const valueStart = itemsMatch.index + itemsMatch[0].length
  let baseText = captureValueUntilTerminator(argsText, valueStart, [',', '}'])
  if (baseText === '') {
    return { ok: false, reason: 'empty items: value' }
  }

  if (/^[A-Za-z_$][\w$]*$/.test(baseText)) {
    const resolved = resolveDeclaredRhs(content, baseText)
    if (resolved != null) baseText = resolved
  }

  const split = splitAtLastTopLevelMap(baseText)
  const finalBase = split ? split.base : baseText
  if (finalBase === '') {
    return { ok: false, reason: 'could not isolate a base expression before .map()/.flatMap()' }
  }
  return { ok: true, tokens: tokenize(finalBase), baseText: finalBase }
}

// ── `confirm` anchor resolution ──────────────────────────────────────────────────

/**
 * Resolves a hand-curated `{ pattern, token }[]` anchor list against file
 * content: each pattern found contributes its token (in the list's
 * curated order, which represents intended visual/semantic order, not
 * necessarily source position); each pattern NOT found is reported in
 * `unverifiable` so a stale mapping surfaces instead of silently passing.
 */
function resolveConfirmTokens(content, items) {
  const tokens = []
  const unverifiable = []
  for (const { pattern, token } of items) {
    if (pattern.test(content)) {
      tokens.push(token)
    } else {
      unverifiable.push(`pattern for token "${token}" not found`)
    }
  }
  return { tokens, unverifiable }
}

// ── Ordered-list comparison (the A2 core) ───────────────────────────────────────

function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

/**
 * Compares two ordered token lists (standing in for the two sides' ordered
 * URL lists — see file header) and classifies the result:
 *   - identical sequence             → clean
 *   - same multiset, different order → order-mismatch
 *   - different multiset              → set-difference, naming which
 *     tokens are extra (present in `a`/JSON-LD, not in `b`/rendered) and
 *     missing (present in `b`/rendered, not in `a`/JSON-LD).
 */
function compareOrderedLists(a, b) {
  if (arraysEqual(a, b)) return { type: 'clean' }

  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  if (arraysEqual(sortedA, sortedB)) return { type: 'order-mismatch' }

  const setA = new Set(a)
  const setB = new Set(b)
  const extra = [...new Set(a.filter((t) => !setB.has(t)))]
  const missing = [...new Set(b.filter((t) => !setA.has(t)))]
  return { type: 'set-difference', extra, missing }
}

// ── Curated route mapping ────────────────────────────────────────────────────────
//
// One entry per `grep -rl "ItemList" apps/web/src/app` match (19 routes).
// See the file header for the recipe shapes. Extended by hand for a 20th
// route exactly like og-coverage-check.mjs's route enumeration and
// heading-semantics-coverage-check.mjs's CURATED_FILES are.

const ROUTE_MAP = [
  // `itemListItems = articles.map(...)` (raw getAllArticles() order).
  // Rendered via <ArchiveList groups={groups} /> where
  // `groups = groupArticlesByMonth(articles)`. groupArticlesByMonth sorts
  // months desc and each month's articles desc by publishedAt — since
  // manifest.articles is itself already publishedAt-desc sorted (verified
  // against apps/web/src/lib/data-runtime/manifest.generated.json), that
  // re-sort is a no-op on the flattened order, so `groups` flattens back
  // to exactly `articles`' own order. Alias asserts that hand-verified
  // equivalence.
  {
    route: '/archive',
    file: 'apps/web/src/app/archive/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: {
      items: [{ pattern: /<ArchiveList\b[^>]*\bgroups=\{\s*groups\s*\}/, token: 'groups' }],
    },
    aliases: { groups: 'articles' },
  },
  // Only emits an ItemList when both ?a and ?b resolve; it's a literal
  // 2-item [boardA, boardB] array, and <BoardCompareTable boardA={boardA}
  // boardB={boardB}> receives them directly as props, not via .map() over
  // an array — no iterated list on either side to diff. Trivially
  // consistent by construction (same two resolved params feed both).
  {
    route: '/compare/board',
    file: 'apps/web/src/app/compare/board/page.tsx',
    skip: 'literal 2-item [boardA, boardB] ItemList; rendered table takes boardA/boardB as direct props, not a .map()\'d array — no list to diff',
  },
  // Same shape as /compare/board, switches instead of boards.
  {
    route: '/compare/switch',
    file: 'apps/web/src/app/compare/switch/page.tsx',
    skip: 'literal 2-item [switchA, switchB] ItemList; rendered table takes switchA/switchB as direct props, not a .map()\'d array — no list to diff',
  },
  // `itemListItems = all.slice(0, ARCHIVE_MAX).map(...)`. Rendered as
  // `lead = all[0]` (<ArticleCard article={lead}>) + `archive =
  // all.slice(1)` capped to ARCHIVE_MAX-1 by <PillarArchiveList
  // articles={archive} max={ARCHIVE_MAX-1}> — lead + capped archive is the
  // same ARCHIVE_MAX-length window of `all`, same order. Aliases assert
  // lead/archive both derive from `all`.
  {
    route: '/deep-dives',
    file: 'apps/web/src/app/deep-dives/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: {
      items: [
        { pattern: /<ArticleCard\b[^>]*\barticle=\{\s*lead\s*\}/, token: 'lead' },
        { pattern: /<PillarArchiveList\b[^>]*\barticles=\{\s*archive\s*\}/, token: 'archive' },
      ],
    },
    aliases: { lead: 'all', archive: 'all' },
  },
  // `itemListItems = [...live, ...announced].map(...)` — deliberately
  // excludes `ended` (confirmed-intentional narrower "— active" scope,
  // spec's precedent #5; no change). Rendered as three SectionStack
  // calls: closingSoon + liveOpen (both urgency-split halves of `live`
  // via splitLiveByUrgency, which — since `live` is pre-sorted ascending
  // by endDate and the urgency threshold is monotonic in endDate —
  // concatenate back to exactly `live`'s own order) + announced. `ended`'s
  // SectionStack is intentionally left out of this comparison.
  {
    route: '/group-buys',
    file: 'apps/web/src/app/group-buys/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: {
      items: [
        { pattern: /\bitems=\{\s*closingSoon\s*\}/, token: 'closingSoon' },
        { pattern: /\bitems=\{\s*liveOpen\s*\}/, token: 'liveOpen' },
        { pattern: /\bitems=\{\s*announced\s*\}/, token: 'announced' },
      ],
    },
    aliases: { closingSoon: 'live', liveOpen: 'live' },
  },
  // `itemListItems = past.map(...)`; rendered inline `{past.map((gb) =>
  // (<GroupBuyRow .../>))}` — same identifier, no alias needed.
  {
    route: '/group-buys/past',
    file: 'apps/web/src/app/group-buys/past/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: { items: [{ pattern: /\bpast\.map\(/, token: 'past' }] },
  },
  // `itemListItems = groups.flatMap((g) => g.articles.map(...))` — the
  // ONLY top-level chain link here is the outer `.flatMap(` (the inner
  // `.map(` is nested inside its still-open paren), so `auto` isolates
  // base = `groups` cleanly. Rendered: `{groups.map((group) => (...))}`
  // — same identifier.
  {
    route: '/guides',
    file: 'apps/web/src/app/guides/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: { items: [{ pattern: /\bgroups\.map\(/, token: 'groups' }] },
  },
  // Triage shape (precedent #865, closes #865): `renderedArticles =
  // [...(buildPick ? [buildPick] : []), ...(lead ? [lead] : []),
  // ...archive.slice(0, ARCHIVE_MAX - 1)]`, then
  // `itemListItems = renderedArticles.map(...)`. `auto` would cut at the
  // LAST top-level `.map(` (the one producing the {name,path} shape),
  // leaving the whole spread-array literal as "base" — which tokenizes
  // fine in isolation, but the rendered side has no single array to
  // auto-extract (buildPick/lead render as separate <ArticleCard> hero
  // slots, archive via <PillarArchiveList>) — `confirm` on both sides
  // keeps the three pieces explicit and in the same curated order.
  {
    route: '/ideas',
    file: 'apps/web/src/app/ideas/page.tsx',
    jsonld: {
      kind: 'confirm',
      items: [
        { pattern: /\.\.\.\(buildPick \? \[buildPick\] : \[\]\)/, token: 'buildPick' },
        { pattern: /\.\.\.\(lead \? \[lead\] : \[\]\)/, token: 'lead' },
        { pattern: /archive\.slice\(0,\s*ARCHIVE_MAX\s*-\s*1\)/, token: 'archive' },
      ],
    },
    rendered: {
      items: [
        { pattern: /<ArticleCard\b[^>]*\barticle=\{\s*buildPick\s*\}/, token: 'buildPick' },
        { pattern: /<ArticleCard\b[^>]*\barticle=\{\s*lead\s*\}/, token: 'lead' },
        { pattern: /<PillarArchiveList\b[^>]*\barticles=\{\s*archive\s*\}/, token: 'archive' },
      ],
    },
  },
  // Same shape as /deep-dives (lead + capped archive window of `all`).
  {
    route: '/news',
    file: 'apps/web/src/app/news/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: {
      items: [
        { pattern: /<ArticleCard\b[^>]*\barticle=\{\s*lead\s*\}/, token: 'lead' },
        { pattern: /<PillarArchiveList\b[^>]*\barticles=\{\s*archive\s*\}/, token: 'archive' },
      ],
    },
    aliases: { lead: 'all', archive: 'all' },
  },
  // `items: newsletters.map(...)` inline; rendered via <NewsletterArchive
  // newsletters={newsletters} /> — same identifier, no alias needed.
  {
    route: '/newsletter',
    file: 'apps/web/src/app/newsletter/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: {
      items: [
        { pattern: /<NewsletterArchive\b[^>]*\bnewsletters=\{\s*newsletters\s*\}/, token: 'newsletters' },
      ],
    },
  },
  // Precedent #862 (closes #862): `itemListPaths = byPillarPicks`, where
  // `byPillarPicks = resolveLatestByPillar(latestByPillar, undefined,
  // heroExcludeSlugs)`. Rendered via <LatestByPillar articles=
  // {latestByPillar} excludeSlugs={heroExcludeSlugs} />, which internally
  // calls `resolveLatestByPillar(articles, HOME_PILLAR_SET, excludeSlugs)`
  // — `undefined` pillars on the page side resolves to the same
  // HOME_PILLAR_SET default inside resolveLatestByPillar, and
  // LatestByPillar's own call passes that same default explicitly, so the
  // two calls are equivalent given matching `articles`/`excludeSlugs`
  // arguments (verified by reading apps/web/src/components/home/
  // LatestByPillar.tsx). `confirm` anchors both call sites and asserts
  // the same symbolic token.
  {
    route: '/',
    file: 'apps/web/src/app/page.tsx',
    jsonld: {
      kind: 'confirm',
      items: [
        {
          pattern: /resolveLatestByPillar\(\s*latestByPillar\s*,\s*undefined\s*,\s*heroExcludeSlugs\s*,?\s*\)/,
          token: 'byPillarPicks',
        },
      ],
    },
    rendered: {
      file: 'apps/web/src/components/home/LatestByPillar.tsx',
      items: [
        {
          pattern: /resolveLatestByPillar\(\s*articles\s*,\s*HOME_PILLAR_SET\s*,\s*excludeSlugs\s*\)/,
          token: 'byPillarPicks',
        },
      ],
    },
  },
  // `items: parts.map(...)` inline; rendered inline `{parts.map((part) =>
  // (<PartIndexCard .../>))}` — same identifier.
  {
    route: '/part/[kind]',
    file: 'apps/web/src/app/part/[kind]/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: { items: [{ pattern: /\bparts\.map\(/, token: 'parts' }] },
  },
  // `items: sections.map(...)` inline (sections is itself a literal
  // array); rendered inline `{sections.map((s) => (<Link .../>))}` — same
  // identifier.
  {
    route: '/parts',
    file: 'apps/web/src/app/parts/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: { items: [{ pattern: /\bsections\.map\(/, token: 'sections' }] },
  },
  // Precedent #866 (closes #866): `items: getSortedCitedRows(rows).map(
  // ...)`. Rendered via <SourceCounts rows={rows} />, which internally
  // calls `getSortedCitedRows(rows)` too (verified by reading
  // apps/web/src/components/sources/SourceCounts.tsx) — `confirm` anchors
  // both call sites.
  {
    route: '/sources',
    file: 'apps/web/src/app/sources/page.tsx',
    jsonld: {
      kind: 'confirm',
      items: [{ pattern: /getSortedCitedRows\(\s*rows\s*\)/, token: 'sortedCitedRows' }],
    },
    rendered: {
      file: 'apps/web/src/components/sources/SourceCounts.tsx',
      items: [{ pattern: /getSortedCitedRows\(\s*rows\s*\)/, token: 'sortedCitedRows' }],
    },
  },
  // `itemListItems = articles.map(...)`; rendered inline
  // `{articles.map((article) => (<ArticleCard .../>))}` — same
  // identifier.
  {
    route: '/tag/[slug]',
    file: 'apps/web/src/app/tag/[slug]/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: { items: [{ pattern: /\barticles\.map\(/, token: 'articles' }] },
  },
  // Precedent #864 (closes #864): `itemListItems =
  // CATEGORY_ORDER.flatMap((cat) => groups.get(cat) ?? []).map(...)`,
  // `groups = groupTagsByCategory(tags)`. Here there ARE two chained
  // top-level calls (flatMap then the shape-producing map), so `auto`
  // would cut at the LAST one and keep the first flatMap's whole clause
  // — including its own `cat`/`groups.get` callback tokens — as "base",
  // which is noisy (unlike /guides' single-top-level-call shape). The
  // rendered side (<TagsIndex tags={tags} />, which internally computes
  // `groupTagsByCategory(tags)` too — see apps/web/src/components/tags/
  // TagsIndex.tsx) can't be auto-extracted from page.tsx at all (the
  // page passes raw `tags`, not `groups`, as the prop). `confirm` on both
  // sides, anchored on the shared `groupTagsByCategory(tags)` call,
  // avoids the noise entirely.
  {
    route: '/tags',
    file: 'apps/web/src/app/tags/page.tsx',
    jsonld: {
      kind: 'confirm',
      items: [{ pattern: /groupTagsByCategory\(\s*tags\s*\)/, token: 'tagsByCategory' }],
    },
    rendered: {
      file: 'apps/web/src/components/tags/TagsIndex.tsx',
      items: [{ pattern: /groupTagsByCategory\(\s*tags\s*\)/, token: 'tagsByCategory' }],
    },
  },
  // `items: TOOLS.map(...)` inline (TOOLS is a literal array); rendered
  // inline `{TOOLS.map((tool) => (<Link .../>))}` — same identifier.
  {
    route: '/tools',
    file: 'apps/web/src/app/tools/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: { items: [{ pattern: /\bTOOLS\.map\(/, token: 'TOOLS' }] },
  },
  // Same shape as /deep-dives and /news (lead + capped archive window of
  // `all`).
  {
    route: '/trends',
    file: 'apps/web/src/app/trends/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: {
      items: [
        { pattern: /<ArticleCard\b[^>]*\barticle=\{\s*lead\s*\}/, token: 'lead' },
        { pattern: /<PillarArchiveList\b[^>]*\barticles=\{\s*archive\s*\}/, token: 'archive' },
      ],
    },
    aliases: { lead: 'all', archive: 'all' },
  },
  // `items: vendors.map(...)` inline; rendered inline `{vendors.map(
  // (vendor) => (<VendorCard .../>))}` — same identifier.
  {
    route: '/vendors',
    file: 'apps/web/src/app/vendors/page.tsx',
    jsonld: { kind: 'auto' },
    rendered: { items: [{ pattern: /\bvendors\.map\(/, token: 'vendors' }] },
  },
]

// ── Evaluation ───────────────────────────────────────────────────────────────────

/** Collects every file path an entry needs (its own + any rendered override). */
function filesNeededFor(entry) {
  const files = new Set()
  if (entry.file) files.add(entry.file)
  if (entry.jsonld?.file) files.add(entry.jsonld.file)
  if (entry.rendered?.file) files.add(entry.rendered.file)
  return files
}

function evaluateRoute(entry, fileContents) {
  if (entry.skip) {
    return { route: entry.route, status: 'skipped', reason: entry.skip }
  }

  const mainContent = fileContents.get(entry.file)
  if (mainContent == null) {
    return { route: entry.route, status: 'unverifiable', reason: `file not found: ${entry.file}` }
  }

  let jsonldTokensRaw
  const unverifiable = []

  if (entry.jsonld.kind === 'auto') {
    const result = extractJsonldAuto(mainContent)
    if (!result.ok) {
      unverifiable.push(`jsonld: ${result.reason}`)
      jsonldTokensRaw = []
    } else {
      jsonldTokensRaw = result.tokens
    }
  } else {
    const content = entry.jsonld.file ? fileContents.get(entry.jsonld.file) : mainContent
    const result = resolveConfirmTokens(content ?? '', entry.jsonld.items)
    unverifiable.push(...result.unverifiable.map((r) => `jsonld: ${r}`))
    jsonldTokensRaw = result.tokens
  }

  const renderedContent = entry.rendered.file ? fileContents.get(entry.rendered.file) : mainContent
  const renderedResult = resolveConfirmTokens(renderedContent ?? '', entry.rendered.items)
  unverifiable.push(...renderedResult.unverifiable.map((r) => `rendered: ${r}`))

  if (unverifiable.length > 0) {
    return { route: entry.route, status: 'unverifiable', reason: unverifiable.join('; ') }
  }

  const aliases = entry.aliases ?? {}
  const jsonldTokens = applyAliasesAndCollapse(jsonldTokensRaw, aliases)
  const renderedTokens = applyAliasesAndCollapse(renderedResult.tokens, aliases)

  const cmp = compareOrderedLists(jsonldTokens, renderedTokens)
  return {
    route: entry.route,
    status: cmp.type,
    jsonldTokens,
    renderedTokens,
    extra: cmp.extra,
    missing: cmp.missing,
  }
}

/** Reads every file every mapped route needs, once, keyed by repo-relative path. */
function readAllFiles(routeMap) {
  const needed = new Set()
  for (const entry of routeMap) {
    for (const f of filesNeededFor(entry)) needed.add(f)
  }
  const contents = new Map()
  for (const relPath of needed) {
    const absPath = join(REPO_ROOT, relPath)
    try {
      contents.set(relPath, readFileSync(absPath, 'utf8'))
    } catch {
      // Left unset — evaluateRoute reports "file not found".
    }
  }
  return contents
}

function evaluateAll(routeMap = ROUTE_MAP) {
  const fileContents = readAllFiles(routeMap)
  return routeMap.map((entry) => evaluateRoute(entry, fileContents))
}

// ── Deduplication ─────────────────────────────────────────────────────────────

/**
 * Returns true if AUDIT.md already has a pending (unchecked) seo row for
 * the given route, filed by this script. Same nearest-`### `-heading
 * walk-back pattern as og-coverage-check.mjs's alreadyFiled().
 */
function alreadyFiled(auditContent, route) {
  const marker = `itemlist-jsonld-parity-check.mjs — ${route}`
  const lines = auditContent.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(marker)) {
      for (let j = i; j >= 0; j--) {
        if (lines[j].startsWith('### ')) {
          return lines[j].startsWith('### [ ]')
        }
      }
    }
  }
  return false
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function describeMismatch(result) {
  if (result.status === 'order-mismatch') {
    return 'same URL set, different order — a reader sees one sequence, Google\'s rich-snippet eligibility reads another'
  }
  const extra = result.extra.length > 0 ? `extra in JSON-LD: ${result.extra.join(', ')}` : null
  const missing = result.missing.length > 0 ? `missing from JSON-LD: ${result.missing.join(', ')}` : null
  return `URL set diverges — ${[extra, missing].filter(Boolean).join('; ')}`
}

function formatAuditRow(result, today) {
  const todayStr = today.toISOString().slice(0, 10)
  return `
### [ ] [seo] [4.6] \`${result.route}\`'s ItemList JSON-LD diverges from its rendered list — ${result.status}
- category: seo
- filed: ${todayStr} by itemlist-jsonld-parity-check.mjs — ${result.route}
- impact: 6 (${describeMismatch(result)} — the same "JSON-LD computed separately from what's rendered" defect class fixed four independent times per plan/13-itemlist-jsonld-parity-check.md)
- ease: 7 (reuse the exact array/derivation the rendered list section already iterates for the JSON-LD \`items:\`, same pattern all four precedent fixes used)
- score: 4.6 (impact × ease / 10)
- evidence: jsonld tokens \`[${result.jsonldTokens.join(', ')}]\` vs rendered tokens \`[${result.renderedTokens.join(', ')}]\`
- action: compute \`${result.route}\`'s ItemList \`items:\` from the exact same source expression the rendered list section iterates, not a separately-derived one
`
}

// ── __test export ─────────────────────────────────────────────────────────────

export const __test = {
  captureStatementExpr,
  captureBalancedInner,
  captureValueUntilTerminator,
  splitAtLastTopLevelMap,
  resolveDeclaredRhs,
  tokenize,
  applyAliasesAndCollapse,
  extractJsonldAuto,
  resolveConfirmTokens,
  compareOrderedLists,
  evaluateRoute,
  evaluateAll,
  alreadyFiled,
  formatAuditRow,
  ROUTE_MAP,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Imported as library — do nothing.
} else {
  const args = process.argv.slice(2)
  const doWrite = args.includes('--write')
  const doJson = args.includes('--json')

  const results = evaluateAll()
  const flagged = results.filter((r) => r.status === 'order-mismatch' || r.status === 'set-difference')
  const skipped = results.filter((r) => r.status === 'skipped')
  const unverifiable = results.filter((r) => r.status === 'unverifiable')

  if (doJson) {
    console.log(JSON.stringify({ flagged, skipped, unverifiable }, null, 2))
    process.exit(0)
  }

  for (const u of unverifiable) {
    console.error(`itemlist-jsonld-parity-check: UNVERIFIABLE ${u.route} — ${u.reason} (mapping may be stale; not gating on this)`)
  }

  if (flagged.length === 0) {
    if (!doWrite) {
      console.log('itemlist-jsonld-parity-check: all mapped routes\' ItemList JSON-LD matches their rendered list — no parity gaps.')
    } else {
      console.log('itemlist-jsonld-parity-check: no parity gaps — no AUDIT rows filed.')
    }
    process.exit(0)
  }

  if (doWrite) {
    let auditContent = ''
    try {
      if (existsSync(AUDIT_MD)) {
        auditContent = readFileSync(AUDIT_MD, 'utf8')
      }
    } catch (err) {
      console.error(`itemlist-jsonld-parity-check: failed to read plan/AUDIT.md — ${err.message}`)
      process.exit(1)
    }

    const today = new Date()
    const rows = []
    let filed = 0
    for (const result of flagged) {
      if (alreadyFiled(auditContent, result.route)) {
        console.log(`itemlist-jsonld-parity-check: ${result.route} already pending in AUDIT.md — skipped`)
        continue
      }
      rows.push(formatAuditRow(result, today))
      console.log(`itemlist-jsonld-parity-check: ${result.route} flagged (${result.status}) — filing AUDIT row`)
      filed++
    }

    if (rows.length > 0) {
      try {
        appendFileSync(AUDIT_MD, rows.join(''))
        console.log(`itemlist-jsonld-parity-check: filed ${filed} AUDIT row(s) → plan/AUDIT.md`)
      } catch (err) {
        console.error(`itemlist-jsonld-parity-check: failed to write plan/AUDIT.md — ${err.message}`)
        process.exit(1)
      }
    }

    process.exit(0)
  }

  // Gate mode: print flagged routes and exit 1
  for (const result of flagged) {
    console.error(`PARITY GAP: ${result.route} — ${result.status} — ${describeMismatch(result)}`)
  }
  console.error(
    `itemlist-jsonld-parity-check: ${flagged.length} route(s) with ItemList/rendered-list parity gaps — compute the JSON-LD items from the exact array the rendered section iterates before shipping.`,
  )
  process.exit(1)
}
