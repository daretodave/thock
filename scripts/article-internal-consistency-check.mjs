#!/usr/bin/env node
// scripts/article-internal-consistency-check.mjs
//
// Diffs an article's/newsletter's own lede/heading claims against its own
// body, so a punchy lede number stops silently contradicting a careful
// figure stated two paragraphs later. Mirrors the resolve-then-diff shape
// of scripts/article-language-check.mjs (CLI/mode conventions, AUDIT row
// formatting) and scripts/content-fact-audit.mjs (frontmatter/body
// extraction helpers, numeric-claim extraction near a token window).
//
// Chunk 06.1 scope (spec plan/06-article-internal-consistency.md,
// acceptance A1 + partial A2): count-style claims only — "N boards",
// "N colorways", "N sizes" — diffed against a comma-separated enumerated
// list elsewhere in the body (or inside an InlineViz `alt` string). The
// dollar/gram-figure diff (full A2) is chunk 06.2; the sibling-citation
// cross-check (A3) is chunk 06.3; march/digest wiring (A4) is chunk 06.4 —
// all out of scope here.
//
// Usage:
//   node scripts/article-internal-consistency-check.mjs <file.mdx> [...]
//     Gate mode: exit 1 if any mismatches, exit 0 if clean.
//
//   node scripts/article-internal-consistency-check.mjs --write
//     Scan mode: walks apps/web/src/content/articles/ and
//     apps/web/src/content/newsletters/, appends one `content` category
//     plan/AUDIT.md row per file with a mismatch. Exit 0 on completion,
//     1 only on an unrecoverable I/O error.
//
//   node scripts/article-internal-consistency-check.mjs --json [<file.mdx>...]
//     JSON output: { mismatches: [...] }. If no files given, walks the
//     full articles + newsletters corpus. Exit 0.
//
// Exit codes:
//   0 → clean (gate mode) or scan complete (--write / --json mode)
//   1 → mismatches found (gate mode) or unrecoverable error (any mode)
//
// Best-effort like every sibling survey: a parse miss or false negative
// is acceptable; a crash on one bad file is not — each file is wrapped in
// its own try/catch and skipped (logged) rather than aborting the run.

import { readFileSync, readdirSync, appendFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const ARTICLES_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'articles')
const NEWSLETTERS_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'newsletters')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// ── Frontmatter / body extraction (mirrors content-fact-audit.mjs) ──────────

function extractBody(content) {
  const rawLines = content.split('\n')
  if (rawLines[0] !== '---') {
    return { body: content, frontmatterText: '' }
  }
  for (let i = 1; i < rawLines.length; i++) {
    if (rawLines[i] === '---') {
      return {
        body: rawLines.slice(i + 1).join('\n'),
        frontmatterText: rawLines.slice(1, i).join('\n'),
      }
    }
  }
  return { body: content, frontmatterText: '' }
}

// Extracts a double-quoted YAML scalar frontmatter field's value, joining
// any line-folded continuation lines (YAML line-folding: a newline plus
// the continuation's leading indent collapses to a single space) — the
// real corpus's `lede:` field is routinely written this way (see
// alice-layout-decline.mdx). Returns null when the field or its closing
// quote isn't found.
function extractFrontmatterField(frontmatterText, field) {
  const startRe = new RegExp(`^${field}:\\s*"`, 'm')
  const startMatch = startRe.exec(frontmatterText)
  if (!startMatch) return null
  const afterOpen = frontmatterText.slice(startMatch.index + startMatch[0].length)
  let raw = ''
  for (let i = 0; i < afterOpen.length; i++) {
    const ch = afterOpen[i]
    if (ch === '"' && afterOpen[i - 1] !== '\\') {
      return raw.replace(/\n\s*/g, ' ').trim()
    }
    raw += ch
  }
  return null // no closing quote found — malformed/truncated field.
}

// First `#`/`##` heading line's text in the body.
function extractFirstHeading(body) {
  const m = /^#{1,2}\s+(.+)$/m.exec(body)
  return m ? m[1].trim() : null
}

// Returns up to `maxParagraphs` plain-prose paragraphs from the start of
// the body — skipping heading lines and JSX/MDX component blocks (a line
// starting with `<`, skipped through its own closing `/>` or `</tag>`
// line). Best-effort, not a real MDX parser: an unusual multi-line JSX
// shape just gets skipped as a block, which only ever makes this stricter
// (fewer false paragraph lines), never looser.
function extractFirstParagraphs(body, maxParagraphs) {
  const lines = body.split('\n')
  const paragraphs = []
  let current = []
  let i = 0
  while (i < lines.length && paragraphs.length < maxParagraphs) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed === '') {
      if (current.length > 0) {
        paragraphs.push(current.join(' '))
        current = []
      }
      i++
      continue
    }
    if (/^#{1,6}\s/.test(trimmed)) {
      i++
      continue
    }
    if (trimmed.startsWith('<')) {
      while (i < lines.length && !/\/>\s*$/.test(lines[i]) && !/^<\/[\w.]+>\s*$/.test(lines[i].trim())) {
        i++
      }
      i++ // skip the closing line itself.
      continue
    }
    current.push(trimmed)
    i++
  }
  if (current.length > 0 && paragraphs.length < maxParagraphs) {
    paragraphs.push(current.join(' '))
  }
  return paragraphs.slice(0, maxParagraphs)
}

// ── Count-style claim extraction ─────────────────────────────────────────────

const NUMBER_WORD_TO_VALUE = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
}

// Plural nouns that share the surface shape this check targets ("<number>
// <plural-noun>") but are measurement/time units, not a count of discrete
// named things with a body enumeration to diff against ("two years", "an
// eight-week window"). Dollar/gram-shaped figures are chunk 06.2's job —
// excluded here on purpose, not merely missed.
const COUNT_NOUN_STOPWORDS = new Set([
  'years',
  'year',
  'weeks',
  'week',
  'months',
  'month',
  'days',
  'day',
  'hours',
  'hour',
  'minutes',
  'minute',
  'seconds',
  'second',
  'dollars',
  'percent',
  'points',
  'point',
  'grams',
  'gram',
  'degrees',
  'degree',
  'times',
])

// A number (digit or number-word, one through twelve) immediately before a
// plural countable noun — "four colorways", "80 switches", "three boards".
// Judgment call: only "number before noun" is handled (never "noun before
// number") — every real-corpus instance surveyed for this chunk phrases the
// claim that way; see the chunk report for the follow-up note.
const COUNT_CLAIM_RE =
  /\b(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)[\s-]+([a-z]+)\b/gi

function extractCountClaims(text) {
  const claims = []
  if (!text) return claims
  COUNT_CLAIM_RE.lastIndex = 0
  let m
  while ((m = COUNT_CLAIM_RE.exec(text)) !== null) {
    const noun = m[2].toLowerCase()
    if (!noun.endsWith('s') || noun.length < 4) continue
    if (COUNT_NOUN_STOPWORDS.has(noun)) continue
    // "the other two switches that belong in the first two" — "other N
    // <noun>" names a remainder/complement count, not the article's
    // headline total, so it isn't comparable to a later full-set
    // enumeration. Real false positive this guards: tactile-stem-
    // geometry-deep-dive.mdx's "two switches" (the two not yet named out
    // of a four-switch set) read as a claim that the whole piece is
    // about two switches.
    const beforeMatch = text.slice(Math.max(0, m.index - 10), m.index)
    if (/\bother\s*$/i.test(beforeMatch)) continue
    const rawNumber = m[1].toLowerCase()
    const number = /^\d+$/.test(rawNumber) ? Number(rawNumber) : NUMBER_WORD_TO_VALUE[rawNumber]
    if (!number) continue
    // "one buckles", "a pre-bent one buckles the same way" — a literal
    // count of 1 is never phrased with a pluralized noun in the real
    // corpus (a genuine singular claim says "a single X", not "one Xs"),
    // so "one"/"1" immediately before an -s noun is a reliable signal
    // that the matched word is being used as a pronoun ("the pre-bent
    // one") or that the "noun" is actually a verb ("buckles") rather
    // than a real count claim. Real false positive this guards:
    // buckling-spring-deep-dive.mdx's "a pre-bent one buckles the same
    // way every time" was read as a claim of "one buckle".
    if (number === 1) continue
    claims.push({ number, noun, index: m.index, text: m[0] })
  }
  return claims
}

// ── Enumerated-list lookup ────────────────────────────────────────────────────

// An em-dash- or colon-introduced comma-separated (optionally
// "and"/"or"-joined) run of 2+ short items, anchored to appear (after
// only whitespace) immediately following the noun — the house corpus's
// own convention for stating a count claim right before its enumerated
// list (real examples: cannonkeys-nyawice-group-buy.mdx's "four
// colorways — orange, pink, baby blue, lilac"; brass-weight-mod.mdx's
// "one of three things: a milled brass ... plate ..., a set of brass
// weights ..., or brass feet ..."; an InlineViz `alt` string carries the
// same shape, e.g. "Three mount-style cards in a row — gasket-mount ...,
// leaf-spring F1 ..., and tray-mount ..."). Anchored with `^` (tested
// against the text starting right after the noun, not matched anywhere
// inside it) on purpose: an earlier, unrelated mention of the same noun —
// e.g. a heading like "## The colorways" with no list of its own — must
// not let a list several sentences later get credited to it, which a
// floating (non-anchored) search would otherwise do. The item character
// class deliberately excludes `.` and newlines, so a match can't run on
// past the end of its own sentence/line even though no explicit length
// cap is applied — items can be as long as a real sentence needs.
const LIST_INTRO_RE =
  /^\s*[—:]\s*([A-Za-z0-9][\w'’%×/() -]*(?:,\s*(?:and\s+|or\s+)?[A-Za-z0-9][\w'’%×/() -]*){1,})/

// Words allowed immediately before the noun occurrence an enumeration is
// read off of — determiners/quantifiers that keep the mention referring
// to the *whole* set the claim is about, same as the claim's own "<number>
// <noun>" phrasing. A capitalized word outside this list immediately
// before the noun (e.g. "Uniform profiles — DSA, KAT, XDA") signals a
// *qualified subset* mention instead, not the full set the lede/heading
// claim is about — real false positive this guards: keycap-profiles-
// compared.mdx's lede claims "four profiles" (DSA, KAT, SA, MT3 — the
// Cherry/OEM/SA/MT3 family — see its own body), but "Uniform profiles —
// DSA, KAT, XDA" only enumerates the uniform-sculpt subset of three.
const ENUMERATION_PRECEDING_WORD_ALLOWLIST =
  /^(?:the|these|those|all|both|its|our|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d+)$/i

// A short leading-preposition fragment ("and on tactiles,") is a fronted
// adverbial clause describing the *next* list item, not a parallel item
// of its own — comma-splitting can't tell the two shapes apart by
// punctuation alone, so this merges a short prepositional fragment into
// whichever item follows it. Real false positive this guards:
// lubing-switches-guide.mdx's "Lube changes three things: it quiets
// plastic-on-plastic friction, it dampens spring resonance, and on
// tactiles, it can eliminate the very feature..." was counting "on
// tactiles" as a fourth item instead of reading it as part of the third.
function mergeShortPrepositionalFragments(items) {
  const SHORT_PREP_FRAGMENT_RE = /^(?:on|in|at|for|with|under|among|during|after|before)\s+\S+(?:\s+\S+)?$/i
  const merged = []
  for (let i = 0; i < items.length; i++) {
    if (SHORT_PREP_FRAGMENT_RE.test(items[i]) && i + 1 < items.length) {
      merged.push(`${items[i]}, ${items[i + 1]}`)
      i++ // consumed the next item as part of this merge.
    } else {
      merged.push(items[i])
    }
  }
  return merged
}

// Finds the first occurrence of `noun` in `text` that has an enumerated
// list immediately after it, and returns the list's item count. Searches
// every occurrence of the noun (not just the first) since the claim's own
// source text (lede/heading/first-2-paragraphs) may itself mention the
// noun without an adjacent list — the list usually lives later in the
// body.
function findEnumeratedListNear(text, noun) {
  const nounRe = new RegExp(`\\b${noun}\\b`, 'gi')
  let m
  while ((m = nounRe.exec(text)) !== null) {
    const precedingWordMatch = /(\S+)\s*$/.exec(text.slice(0, m.index))
    const precedingWord = precedingWordMatch ? precedingWordMatch[1] : ''
    if (
      precedingWord &&
      /^[A-Z]/.test(precedingWord) &&
      !ENUMERATION_PRECEDING_WORD_ALLOWLIST.test(precedingWord)
    ) {
      continue // qualified-subset mention, not the full set — see comment above.
    }
    const afterNoun = text.slice(m.index + m[0].length)
    const listMatch = LIST_INTRO_RE.exec(afterNoun)
    if (listMatch) {
      const rawItems = listMatch[1]
        .split(',')
        .map((s) => s.trim().replace(/^(?:and|or)\s+/i, '').replace(/[.;:]+$/, '').trim())
        .filter(Boolean)
      const items = mergeShortPrepositionalFragments(rawItems)
      if (items.length >= 2) {
        return { count: items.length, items, index: m.index }
      }
    }
  }
  return null
}

// ── Count-style mismatch detection (acceptance A2, count half) ───────────────

// Extracts count claims from the lede, first heading, and first 2 body
// paragraphs, then diffs each against the nearest body enumeration of the
// same noun. First claim per noun wins (a repeat mention of the same noun
// in, say, both the lede and the first paragraph is the same claim, not a
// second independent one).
function findCountMismatches(frontmatterText, body) {
  const lede = extractFrontmatterField(frontmatterText, 'lede')
  const heading = extractFirstHeading(body)
  const paragraphs = extractFirstParagraphs(body, 2)

  const claimSources = [
    { source: 'lede', text: lede },
    { source: 'first heading', text: heading },
    ...paragraphs.map((text, i) => ({ source: `body paragraph ${i + 1}`, text })),
  ]

  const mismatches = []
  const seenNouns = new Set()
  for (const { source, text } of claimSources) {
    for (const claim of extractCountClaims(text)) {
      if (seenNouns.has(claim.noun)) continue
      seenNouns.add(claim.noun)

      const found = findEnumeratedListNear(body, claim.noun)
      if (!found) continue // no body enumeration to diff against — skip, don't guess.
      if (found.count !== claim.number) {
        mismatches.push({
          kind: 'count',
          noun: claim.noun,
          claimSource: source,
          claimNumber: claim.number,
          foundCount: found.count,
          foundItems: found.items,
        })
      }
    }
  }
  return mismatches
}

// ── Content file resolution (articles + newsletters) ────────────────────────

// `dir` is 'articles' or 'newsletters' — carried on each mismatch so
// formatAuditRow can point at the right content path. Throws only on a
// problem with the file itself; callers wrap this in a try/catch.
function checkContentFile(filePath, dir) {
  const content = readFileSync(filePath, 'utf8')
  const slug = basename(filePath, '.mdx')
  const { body, frontmatterText } = extractBody(content)
  const mismatches = findCountMismatches(frontmatterText, body).map((m) => ({ ...m, dir }))
  return { slug, mismatches }
}

function checkArticle(filePath) {
  return checkContentFile(filePath, 'articles')
}

function checkNewsletter(filePath) {
  return checkContentFile(filePath, 'newsletters')
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function describeMismatch(m) {
  return `${m.claimSource} claims "${m.claimNumber} ${m.noun}" but the body enumerates ${m.foundCount} ${m.noun}: ${m.foundItems.join(', ')}`
}

function formatAuditRow(slug, dir, mismatches, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const count = mismatches.length
  const noun = count === 1 ? 'mismatch' : 'mismatches'
  const mismatchLines = mismatches.map((m) => `  - ${describeMismatch(m)}`).join('\n')

  return `\n### [ ] [content] [3.6] ${slug} — ${count} internal count ${noun} detected by article-internal-consistency-check.mjs
- category: content
- filed: ${todayStr} by article-internal-consistency-check.mjs corpus scan
- impact: 4 (a lede/body count contradiction undermines the article's own numbers on every reader visit)
- ease: 9 (reconcile the count claim with the enumerated list — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/${dir}/${slug}.mdx
- mismatches:
${mismatchLines}
- action: make the lede/heading count agree with the body's enumerated list (or fix the list if it's the one that's wrong)\n`
}

// ── __test export (for scripts/__tests__/article-internal-consistency-check.test.mjs) ─

export const __test = {
  extractBody,
  extractFrontmatterField,
  extractFirstHeading,
  extractFirstParagraphs,
  extractCountClaims,
  mergeShortPrepositionalFragments,
  findEnumeratedListNear,
  findCountMismatches,
  checkArticle,
  checkNewsletter,
  checkContentFile,
  describeMismatch,
  formatAuditRow,
}

// ── CLI entry (only runs when this file is invoked directly) ────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Exported as a library — do nothing.
} else {

const args = process.argv.slice(2)
const doWrite = args.includes('--write')
const doJson = args.includes('--json')
const fileArgs = args.filter((a) => !a.startsWith('--') && a.endsWith('.mdx'))

function dirForPath(filePath) {
  return filePath.includes('/newsletters/') ? 'newsletters' : 'articles'
}

// Determine which files to scan.
let targets = []
if (doWrite || (doJson && fileArgs.length === 0)) {
  // Scan mode: walk both corpora.
  try {
    const articleFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))
    targets.push(...articleFiles.map((f) => ({ filePath: join(ARTICLES_DIR, f), dir: 'articles' })))
  } catch (err) {
    console.error(`article-internal-consistency-check: failed to read articles dir — ${err.message}`)
    process.exit(1)
  }
  try {
    const newsletterFiles = readdirSync(NEWSLETTERS_DIR).filter((f) => f.endsWith('.mdx'))
    targets.push(
      ...newsletterFiles.map((f) => ({ filePath: join(NEWSLETTERS_DIR, f), dir: 'newsletters' })),
    )
  } catch (err) {
    console.error(`article-internal-consistency-check: failed to read newsletters dir — ${err.message}`)
    process.exit(1)
  }
} else if (fileArgs.length > 0) {
  // Gate mode: specific files.
  targets = fileArgs.map((filePath) => ({ filePath, dir: dirForPath(filePath) }))
} else if (!doWrite && !doJson) {
  console.error('article-internal-consistency-check: no files specified and --write not set')
  console.error('Usage: article-internal-consistency-check.mjs <file.mdx> [...] | --write | --json')
  process.exit(1)
}

// Scan files. Best-effort: a single file that fails to parse is logged and
// skipped, never crashes the whole run with a raw stack trace.
const results = []
for (const { filePath, dir } of targets) {
  try {
    results.push(checkContentFile(filePath, dir))
  } catch (err) {
    console.error(`article-internal-consistency-check: skipped ${filePath} — ${err.message}`)
    if (!doWrite && !doJson) process.exit(1)
  }
}

const allMismatches = []
for (const { slug, mismatches } of results) {
  for (const m of mismatches) allMismatches.push({ slug, ...m })
}

if (doJson) {
  console.log(JSON.stringify({ mismatches: allMismatches }, null, 2))
  process.exit(0)
}

if (doWrite) {
  if (allMismatches.length === 0) {
    console.log('article-internal-consistency-check: corpus clean — no AUDIT rows filed.')
    process.exit(0)
  }

  const bySlug = new Map() // slug -> { dir, mismatches: [] }
  for (const m of allMismatches) {
    if (!bySlug.has(m.slug)) bySlug.set(m.slug, { dir: m.dir, mismatches: [] })
    bySlug.get(m.slug).mismatches.push(m)
  }

  const today = new Date()
  const rows = []
  for (const [slug, { dir, mismatches }] of bySlug) {
    rows.push(formatAuditRow(slug, dir, mismatches, today))
    console.log(
      `article-internal-consistency-check: ${mismatches.length} mismatch(es) in ${dir}/${slug}.mdx — filing AUDIT row`,
    )
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(`article-internal-consistency-check: filed ${bySlug.size} AUDIT row(s) → plan/AUDIT.md`)
  } catch (err) {
    console.error(`article-internal-consistency-check: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Gate mode: print mismatches and exit 1 if any found.
if (allMismatches.length === 0) {
  console.log('article-internal-consistency-check: clean — no mismatches found.')
  process.exit(0)
}

for (const m of allMismatches) {
  console.log(`MISMATCH ${m.dir}/${m.slug}.mdx — ${describeMismatch(m)}`)
}

console.error(
  `article-internal-consistency-check: ${allMismatches.length} mismatch(es) found — fix before committing.`,
)
process.exit(1)

} // end isMain
