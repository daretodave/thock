#!/usr/bin/env node
// scripts/content-fact-audit.mjs
//
// Cross-checks numeric claims in article prose against the data/ records
// they cite, filing a `content` category plan/AUDIT.md row on mismatch.
// Mirrors scripts/article-parts-check.mjs's resolve-then-diff shape and
// scripts/group-buy-status-check.mjs's AUDIT filing/dedup convention.
//
// Chunk 01.1 scope (spec plan/01-content-fact-audit.md, acceptance A1):
// switch spring/actuation-weight citations only — for each article's
// mentionedParts switches, scan the body for "<N>g" / "<N> gram" /
// "<N>-gram" patterns near the switch's name or PartReference alias and
// diff the found value against data/switches/<slug>.json's
// springGrams.actuation / springGrams.bottomOut.
//
// Tracker-score citations, the "N weeks ago" sub-shape, and the march/digest
// wiring are chunks 01.2/01.3/01.4 — out of scope here.
//
// Usage:
//   node scripts/content-fact-audit.mjs
//     Dry-run: scans every article in apps/web/src/content/articles/,
//     prints what would be filed. Exit 1 if any mismatches found, 0 if
//     clean. Best-effort: a single unreadable/malformed article is logged
//     and skipped rather than crashing the whole run.
//
//   node scripts/content-fact-audit.mjs --write
//     Scan mode: appends plan/AUDIT.md rows for each mismatch found.
//     Deduplicates against existing pending rows by article slug + claim
//     (switch + field). Exit 0 on completion; exit 1 only on an
//     unrecoverable error (e.g. failing to read/write plan/AUDIT.md).
//
//   node scripts/content-fact-audit.mjs --json
//     JSON output: { mismatches: [...] }. Exit 0.
//
// Exit codes:
//   0 → clean (dry-run) or scan complete (--write / --json)
//   1 → mismatches found (dry-run) or unrecoverable error (any mode)

import { readFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const ARTICLES_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'articles')
const SWITCHES_DIR = join(REPO_ROOT, 'data', 'switches')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// A number is only attributed to a switch mention if it falls within this
// many whitespace-separated tokens of that switch's name/alias occurrence —
// the "short token window" from the spec design, calibrated against the
// real corpus's citation distances (component-tag-to-number runs are
// typically 5-15 tokens; this gives headroom without crossing into an
// unrelated switch's own citation in the same paragraph).
const WINDOW_TOKENS = 20

// Keyword search radius (tokens) used to decide whether a found number is
// claiming "actuation" or "bottomOut" specifically.
const FIELD_WINDOW_TOKENS = 8

// ── Frontmatter / body extraction (mirrors article-parts-check.mjs) ──────────

function extractBody(content) {
  const rawLines = content.split('\n')
  if (rawLines[0] !== '---') {
    return { body: content, bodyStartLine: 1 }
  }
  for (let i = 1; i < rawLines.length; i++) {
    if (rawLines[i] === '---') {
      return { body: rawLines.slice(i + 1).join('\n'), bodyStartLine: i + 2 }
    }
  }
  return { body: content, bodyStartLine: 1 }
}

function extractFrontmatterText(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? m[1] : ''
}

// Returns Array<{ id: string, slug: string, kind: string }>.
function parseMentionedParts(frontmatterText) {
  const lines = frontmatterText.split('\n')
  const parts = []
  let inParts = false
  let currentPart = null

  for (const line of lines) {
    if (/^mentionedParts:/.test(line)) {
      inParts = true
      continue
    }
    if (inParts) {
      if (/^\w/.test(line)) {
        inParts = false
        if (currentPart && currentPart.slug && currentPart.kind) parts.push(currentPart)
        currentPart = null
        continue
      }
      if (/^\s+-/.test(line)) {
        if (currentPart && currentPart.slug && currentPart.kind) parts.push(currentPart)
        currentPart = {}
        // YAML writes the first property inline with the dash
        // (e.g. "  - id: oil-king"), so parse it off this same line
        // rather than losing it when currentPart was just reset.
        const inlineIdM = line.match(/^\s+-\s*id:\s*(.+)/)
        if (inlineIdM) currentPart.id = inlineIdM[1].trim()
        continue
      }
      if (currentPart !== null) {
        const idM = line.match(/^\s+id:\s*(.+)/)
        const slugM = line.match(/^\s+slug:\s*(.+)/)
        const kindM = line.match(/^\s+kind:\s*(.+)/)
        if (idM) currentPart.id = idM[1].trim()
        if (slugM) currentPart.slug = slugM[1].trim()
        if (kindM) currentPart.kind = kindM[1].trim()
      }
    }
  }

  if (currentPart && currentPart.slug && currentPart.kind) parts.push(currentPart)
  return parts
}

// ── Switch data loading ───────────────────────────────────────────────────────

function loadSwitchRecord(slug) {
  const raw = readFileSync(join(SWITCHES_DIR, `${slug}.json`), 'utf8')
  return JSON.parse(raw)
}

// ── Numeric citation scanning ─────────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Word-count distance between two character offsets in `text`, counting the
// whitespace-separated tokens strictly between them (excluding whichever
// token each offset itself falls inside). Order-independent.
function wordDistance(text, posA, posB) {
  const [lo, hi] = posA <= posB ? [posA, posB] : [posB, posA]
  // Skip past the end of the token containing `lo`, so that token isn't
  // double-counted as something "between" the two offsets.
  const restFromLo = text.slice(lo)
  const gapIndex = restFromLo.search(/\s/)
  const loTokenEnd = gapIndex === -1 ? text.length : lo + gapIndex
  const between = text.slice(loTokenEnd, hi).trim()
  if (between === '') return 0
  return between.split(/\s+/).filter(Boolean).length
}

// Finds every occurrence of a switch's full name (word-bounded,
// case-insensitive) or its mentionedParts `id` used as a PartReference
// alias (`id="<alias>"` / `id='<alias>'` in the raw MDX source — the
// literal rendered name isn't present in source for a self-closing
// <PartReference id="..." /> tag, so the attribute value is the only
// reliable textual anchor for that usage).
function findNameMentions(body, part, switchRecord) {
  const mentions = []
  const nameRe = new RegExp(`\\b${escapeRegex(switchRecord.name)}\\b`, 'gi')
  let m
  while ((m = nameRe.exec(body)) !== null) {
    mentions.push(m.index)
  }
  if (part.id) {
    const aliasRe = new RegExp(`id=["']${escapeRegex(part.id)}["']`, 'g')
    while ((m = aliasRe.exec(body)) !== null) {
      mentions.push(m.index)
    }
  }
  return mentions
}

// Matches "<N>g", "<N> gram(s)", "<N>-gram(s)" — but not "<N>g/cm³" (density,
// not weight) and not a trailing digit run like "205g0" (a lubricant name,
// e.g. Krytox 205g0 — the \b after the alternative already excludes this
// since "g0" has no word/non-word transition).
const GRAM_RE = /(\d+(?:\.\d+)?)[\s-]*(?:grams?|g)\b(?!\/)/gi

function findGramNumbers(body) {
  const numbers = []
  let m
  GRAM_RE.lastIndex = 0
  while ((m = GRAM_RE.exec(body)) !== null) {
    numbers.push({ index: m.index, value: Number(m[1]) })
  }
  return numbers
}

const ACTUATION_RE = /actuation/i
const BOTTOM_OUT_RE = /bottom[\s-]?out/i
// "a 12-gram spread", "a 7-gram delta", "the 6-gram gap" — these describe
// the *difference* between actuation and bottom-out, not either absolute
// weight. Recurring phrasing in the switch-comparison corpus; without this
// guard the delta value gets diffed against an absolute springGrams field
// and flagged as a false-positive mismatch.
const DELTA_RE = /\b(?:spread|delta|gap)\b/i

// Looks within FIELD_WINDOW_TOKENS of `numberIndex` for a delta-ish keyword
// first (see DELTA_RE — a delta phrase like "spread to bottom-out at just
// 6 grams" often has "bottom-out" sitting *closer* to the number than
// "spread" does, so delta detection must win on presence, not nearness),
// then falls back to the nearest of "actuation" / "bottom-out" to decide
// which springGrams field (if any) the citation claims. Returns
// 'actuation' | 'bottomOut' | 'delta' | null (ambiguous — no keyword close
// enough). Callers must treat 'delta' as "not an absolute-weight citation —
// skip".
function detectField(body, numberIndex) {
  const loBound = Math.max(0, numberIndex - 200)
  const hiBound = Math.min(body.length, numberIndex + 200)
  const windowText = body.slice(loBound, hiBound)
  const windowOffset = loBound

  const withinWindow = (regex) => {
    const re = new RegExp(regex, 'gi')
    let m
    while ((m = re.exec(windowText)) !== null) {
      const dist = wordDistance(body, numberIndex, windowOffset + m.index)
      if (dist <= FIELD_WINDOW_TOKENS) return true
    }
    return false
  }
  if (withinWindow(DELTA_RE)) return 'delta'

  let best = null // { field, distance }
  const consider = (regex, field) => {
    const re = new RegExp(regex, 'gi')
    let m
    while ((m = re.exec(windowText)) !== null) {
      const dist = wordDistance(body, numberIndex, windowOffset + m.index)
      if (dist <= FIELD_WINDOW_TOKENS && (!best || dist < best.distance)) {
        best = { field, distance: dist }
      }
    }
  }
  consider(ACTUATION_RE, 'actuation')
  consider(BOTTOM_OUT_RE, 'bottomOut')
  return best ? best.field : null
}

// Sentence boundary offsets (start-of-sentence positions, including 0),
// used to prefer a same-sentence switch mention over a token-closer one
// in the next sentence. The recurring enumeration shape "Switch A actuates
// at 55g and bottoms out at 67g. The Switch B actuates at..." puts the
// *next* subject only 1-2 tokens after a trailing number that still
// belongs to the *current* sentence's switch — a pure nearest-token-distance
// heuristic misattributes it forward. This is a best-effort, not a real
// parser: abbreviations like "e.g." will over-split, which only ever makes
// the window stricter (same-sentence fails to match, falls back to the
// global nearest-mention search below), never looser.
function segmentSentenceBoundaries(text) {
  const boundaries = [0]
  const re = /[.!?]\s+/g
  let m
  while ((m = re.exec(text)) !== null) {
    boundaries.push(m.index + m[0].length)
  }
  return boundaries
}

// Index of the greatest boundary <= offset (binary search).
function sentenceIndexAt(boundaries, offset) {
  let lo = 0
  let hi = boundaries.length - 1
  let ans = 0
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (boundaries[mid] <= offset) {
      ans = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return ans
}

// For each gram-number found in the body, attributes it to a mentionedParts
// switch mention, determines whether it claims actuation or bottomOut
// weight, and diffs it against data/switches/<slug>.json. Returns an array
// of mismatch records.
//
// switchesWithParts: Array<{ part, record }> — part is the mentionedParts
// entry (kind === 'switch'), record is the loaded data/switches/<slug>.json.
function findNumericMismatches(body, switchesWithParts) {
  const boundaries = segmentSentenceBoundaries(body)
  const mentionsBySlug = switchesWithParts.map(({ part, record }) => ({
    slug: record.slug,
    record,
    mentions: findNameMentions(body, part, record).map((index) => ({
      index,
      sentence: sentenceIndexAt(boundaries, index),
    })),
  }))

  const numbers = findGramNumbers(body)
  const mismatches = []

  for (const num of numbers) {
    const numSentence = sentenceIndexAt(boundaries, num.index)

    // Prefer the nearest mention within the *same sentence* as the number —
    // this is what resolves the enumeration-boundary misattribution above.
    let nearest = null // { slug, record, distance }
    for (const entry of mentionsBySlug) {
      for (const mention of entry.mentions) {
        if (mention.sentence !== numSentence) continue
        const dist = wordDistance(body, num.index, mention.index)
        if (!nearest || dist < nearest.distance) {
          nearest = { slug: entry.slug, record: entry.record, distance: dist }
        }
      }
    }

    // No same-sentence mention — fall back to the nearest mention anywhere
    // in the article, still gated by WINDOW_TOKENS.
    if (!nearest) {
      for (const entry of mentionsBySlug) {
        for (const mention of entry.mentions) {
          const dist = wordDistance(body, num.index, mention.index)
          if (!nearest || dist < nearest.distance) {
            nearest = { slug: entry.slug, record: entry.record, distance: dist }
          }
        }
      }
    }

    if (!nearest || nearest.distance > WINDOW_TOKENS) continue

    const { record } = nearest
    const springGrams = record.springGrams || {}
    const field = detectField(body, num.index)
    if (field === 'delta') continue // "N-gram spread/delta/gap" — not an absolute weight claim.

    if (field) {
      const expected = springGrams[field]
      if (typeof expected === 'number' && expected !== num.value) {
        mismatches.push({
          switchSlug: record.slug,
          switchName: record.name,
          field,
          foundValue: num.value,
          expectedValue: expected,
          index: num.index,
        })
      }
    } else {
      // Ambiguous — no "actuation"/"bottom-out" keyword nearby. Only flag
      // when the cited number matches neither recorded field, to keep the
      // false-positive rate down for unlabeled mentions (e.g. a generic
      // "spring weight" aside).
      const { actuation, bottomOut } = springGrams
      const matchesEither =
        (typeof actuation === 'number' && actuation === num.value) ||
        (typeof bottomOut === 'number' && bottomOut === num.value)
      if (!matchesEither && typeof actuation === 'number' && typeof bottomOut === 'number') {
        mismatches.push({
          switchSlug: record.slug,
          switchName: record.name,
          field: 'unspecified',
          foundValue: num.value,
          expectedActuation: actuation,
          expectedBottomOut: bottomOut,
          index: num.index,
        })
      }
    }
  }

  return mismatches
}

// ── Article resolution ────────────────────────────────────────────────────────

// Resolves an article's mentionedParts switch entries against
// data/switches/*.json and finds numeric mismatches in its body.
// Returns { slug, mismatches } — mismatches is [] when clean.
// Throws only on a problem with the article file itself; a missing/
// malformed individual switch record is skipped (best-effort), not fatal.
function checkArticle(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const slug = basename(filePath, '.mdx')
  const frontmatterText = extractFrontmatterText(content)
  const { body } = extractBody(content)
  const mentionedParts = parseMentionedParts(frontmatterText)

  const switchesWithParts = []
  for (const part of mentionedParts) {
    if (part.kind !== 'switch') continue
    try {
      const record = loadSwitchRecord(part.slug)
      switchesWithParts.push({ part, record })
    } catch {
      // Unresolvable switch slug — a sibling concern (data cross-ref
      // integrity), not this script's job. Skip and keep going.
    }
  }

  if (switchesWithParts.length === 0) return { slug, mismatches: [] }

  const mismatches = findNumericMismatches(body, switchesWithParts)
  return { slug, mismatches }
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function describeMismatch(m) {
  if (m.field === 'unspecified') {
    return `${m.switchName} cited at ${m.foundValue}g, but data/switches/${m.switchSlug}.json has neither actuation (${m.expectedActuation}g) nor bottomOut (${m.expectedBottomOut}g) at that value`
  }
  return `${m.switchName} ${m.field} cited at ${m.foundValue}g, but data/switches/${m.switchSlug}.json's springGrams.${m.field} is ${m.expectedValue}g`
}

function claimKey(slug, m) {
  return `${slug}:${m.switchSlug}:${m.field}:${m.foundValue}`
}

function formatAuditRow(slug, mismatch, today) {
  const todayStr = today.toISOString().slice(0, 10)
  return `\n### [ ] [content] [3.6] ${slug} — ${mismatch.switchName} spring-weight citation disagrees with data/switches/${mismatch.switchSlug}.json
- category: content
- filed: ${todayStr} by content-fact-audit.mjs — ${claimKey(slug, mismatch)}
- impact: 4 (factual-accuracy mismatch on published content)
- ease: 9 (one-line prose correction once the mismatch is found)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/articles/${slug}.mdx
- claim: ${describeMismatch(mismatch)}
- action: correct the prose citation to match data/switches/${mismatch.switchSlug}.json's springGrams (or correct the data record if the data is the one that's wrong)\n`
}

// Mirrors article-parts-check.mjs: only treat a still-pending ([ ]) row as
// already filed, so a repeat scan doesn't re-file a claim that's already
// queued but will refile one whose row has since been checked off ([x]).
function alreadyFiled(auditContent, slug, mismatch) {
  const marker = `content-fact-audit.mjs — ${claimKey(slug, mismatch)}`
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

// ── __test export (for scripts/__tests__/content-fact-audit.test.mjs) ────────

export const __test = {
  extractBody,
  extractFrontmatterText,
  parseMentionedParts,
  escapeRegex,
  wordDistance,
  findNameMentions,
  findGramNumbers,
  detectField,
  segmentSentenceBoundaries,
  sentenceIndexAt,
  findNumericMismatches,
  checkArticle,
  formatAuditRow,
  alreadyFiled,
  claimKey,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Exported as a library — do nothing.
} else {

const args = process.argv.slice(2)
const doWrite = args.includes('--write')
const doJson = args.includes('--json')

let files
try {
  files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))
} catch (err) {
  console.error(`content-fact-audit: failed to read articles dir — ${err.message}`)
  process.exit(1)
}

// Best-effort: a single article that fails to parse is logged and skipped,
// never crashes the whole run with a raw stack trace.
const results = []
for (const file of files) {
  const filePath = join(ARTICLES_DIR, file)
  try {
    results.push(checkArticle(filePath))
  } catch (err) {
    console.error(`content-fact-audit: skipped ${file} — ${err.message}`)
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
    console.log('content-fact-audit: corpus clean — no AUDIT rows filed.')
    process.exit(0)
  }

  let auditContent = ''
  try {
    if (existsSync(AUDIT_MD)) {
      auditContent = readFileSync(AUDIT_MD, 'utf8')
    }
  } catch (err) {
    console.error(`content-fact-audit: failed to read plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  const today = new Date()
  const rows = []
  let filed = 0
  for (const m of allMismatches) {
    if (alreadyFiled(auditContent, m.slug, m)) {
      console.log(
        `content-fact-audit: ${claimKey(m.slug, m)} already pending in AUDIT.md — skipped`,
      )
      continue
    }
    rows.push(formatAuditRow(m.slug, m, today))
    console.log(`content-fact-audit: mismatch in ${m.slug}.mdx — ${describeMismatch(m)}`)
    filed++
  }

  if (rows.length === 0) {
    console.log('content-fact-audit: no new AUDIT rows — all mismatches already pending.')
    process.exit(0)
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(`content-fact-audit: filed ${filed} AUDIT row(s) → plan/AUDIT.md`)
  } catch (err) {
    console.error(`content-fact-audit: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Dry-run: print and exit 1 if any mismatches found.
if (allMismatches.length === 0) {
  console.log('content-fact-audit: clean — no numeric citation mismatches found.')
  process.exit(0)
}

for (const m of allMismatches) {
  console.log(`MISMATCH ${m.slug}.mdx — ${describeMismatch(m)}`)
}

console.error(
  `content-fact-audit: ${allMismatches.length} numeric citation mismatch(es) found — run with --write to file AUDIT rows.`,
)
process.exit(1)

} // end isMain
