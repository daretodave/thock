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
// Chunk 01.2 scope (acceptance A2): tracker-score citations — scan article
// AND newsletter bodies for a `W\d\d` tracker-week token near a numeric
// score mention, resolve the cited row by name-mention proximity (the same
// "which entity is this number about" shape as the switch check, but
// sourced from data/trends/<week>.json's own rows[] rather than frontmatter
// mentionedParts), and diff against that row's score.
//
// The "N weeks ago" / streak-length sub-shape and the march/digest wiring
// are chunks 01.3/01.4 — out of scope here.
//
// Usage:
//   node scripts/content-fact-audit.mjs
//     Dry-run: scans every article in apps/web/src/content/articles/ and
//     every newsletter in apps/web/src/content/newsletters/, prints what
//     would be filed. Exit 1 if any mismatches found, 0 if clean.
//     Best-effort: a single unreadable/malformed file is logged and
//     skipped rather than crashing the whole run.
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
const NEWSLETTERS_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'newsletters')
const SWITCHES_DIR = join(REPO_ROOT, 'data', 'switches')
const TRENDS_DIR = join(REPO_ROOT, 'data', 'trends')
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

// Token-distance cap used by the tracker-score citation check (both for
// "nearest number to this W\d\d token" and "nearest row-name mention to
// that number"). This is a secondary sanity cap only — the real
// false-positive guard is the same-sentence requirement in
// findTrendScoreMismatches (see its comment), which is far stricter than
// a pure token-distance window. Calibrated against the real corpus's
// longest legitimate name-to-number span (the "Alice layout's score ...
// from a trough of -66 at W35" sentence in thock-weekly-013.mdx /
// alice-layout-recovery.mdx, ~18 tokens) with headroom.
const WEEK_SCORE_WINDOW_TOKENS = 30

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
  const boundaries = new Set([0])
  const sentenceEndRe = /[.!?]\s+/g
  let m
  while ((m = sentenceEndRe.exec(text)) !== null) {
    boundaries.add(m.index + m[0].length)
  }
  // Markdown structural breaks (heading lines, `---` horizontal rules) also
  // start a fresh span, in addition to sentence-ending punctuation. This
  // matters most for the newsletter corpus added in chunk 01.2: a
  // "## W30 tracker snapshot" heading or a `---` section divider carries no
  // terminal punctuation, so without this a trailing mention in one
  // newsletter item could otherwise read as "same sentence" as a mention in
  // an unrelated adjacent item several sections away — purely because no
  // period sat between them. Isolating structural lines only ever makes
  // same-sentence matching *stricter* (never wrongly joins two spans that
  // punctuation-only splitting would have kept separate).
  const structuralRe = /^(?:#{1,6}[ \t].*|-{3,})[ \t]*$/gm
  while ((m = structuralRe.exec(text)) !== null) {
    boundaries.add(m.index)
    boundaries.add(m.index + m[0].length)
  }
  return Array.from(boundaries).sort((a, b) => a - b)
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

// ── Tracker-score citation scanning (chunk 01.2, acceptance A2) ──────────────
//
// Mirrors the switch-citation shape above (findGramNumbers → attribute to
// nearest named entity → diff against the data record) but the candidate
// "entity list" isn't sourced from frontmatter mentionedParts — it's
// data/trends/<week>.json's own rows[], resolved per `W\d\d` token found in
// the body. See findTrendScoreMismatches for the false-positive guards this
// needed once checked against the real corpus (W\d\d token resolution runs
// into years, percentages, and multi-week sequence lists that the switch
// check never has to worry about).

const WEEK_TOKEN_RE = /\bW(\d{2})\b/g

// A bare, possibly-signed, possibly-decimal number — but not one that's:
//   - the digit run of a `W\d\d` token itself (no \w boundary before "W" in
//     a plain \d+ scan, so this has to be excluded explicitly);
//   - an unsigned, non-decimal 4-digit run — a calendar year, not a score
//     (data/trends/*.json scores never reach four digits; the real-corpus
//     case this guards is "...ending W19 2026 — Alice dropping..." for
//     alice-layout-decline.mdx, where "2026" sits closer to "W19" than the
//     real citation "-18" does);
//   - immediately followed by "%" / "percent" — a "down N percent" framing
//     doesn't correspond 1:1 to the signed score (data/trends/2026-W19.json
//     has Alice at score -18, but alice-layout-decline.mdx's prose says
//     "down 18 percent", not "-18 percent" — diffing the bare 18 against
//     -18 would be a false positive on already-correct content);
//   - immediately followed by "g" / "gram(s)" — that's the switch
//     spring-weight check's citation shape (chunk 01.1), not a tracker
//     score.
const MONTH_NAME_RE =
  /(?:january|february|march|april|may|june|july|august|september|october|november|december)\s*$/i

function findTrendScoreNumbers(body) {
  const numbers = []
  const re = /([+-]?\d+(?:\.\d+)?)/g
  let m
  while ((m = re.exec(body)) !== null) {
    const raw = m[1]
    const index = m.index
    const matchEnd = index + m[0].length
    const before = body[index - 1]
    const after = body[matchEnd]
    // Exclude a digit run that's actually embedded in an alphanumeric
    // product/model token — "KBD75", "QK75", "B40", "B39" in the real
    // corpus (apps/web/src/content/articles/75-percent-default.mdx,
    // alice-layout-recovery.mdx) — not a standalone number at all. A plain
    // `\d+` scan has no letter-adjacency check built in the way a `\b`\-
    // anchored pattern would, so this has to be done by hand on both sides.
    if (/[A-Za-z]/.test(before || '') || /[A-Za-z]/.test(after || '')) continue

    const hasSign = raw[0] === '+' || raw[0] === '-'
    const hasDecimal = raw.includes('.')
    const digitLen = raw.replace(/^[+-]/, '').replace('.', '').length
    if (!hasSign && !hasDecimal && digitLen === 4) continue // year-like

    const rest = body.slice(matchEnd, matchEnd + 12)
    if (/^\s*%/.test(rest) || /^\s*percent\b/i.test(rest)) continue
    if (/^\s*-?\s*grams?\b/i.test(rest) || /^\s*g\b(?!\w)/i.test(rest)) continue

    // Exclude a calendar day-of-month — "week of August 24", "closed July
    // 17" are recurring real-corpus phrasings that sit right next to a
    // `W\d\d` token (divinikey-gmk-cyl-orange-alert-group-buy.mdx: "the
    // 2026-W35 Trends Tracker (week of August 24)") but the number is a
    // date, not a score.
    const precedingText = body.slice(Math.max(0, index - 16), index)
    if (MONTH_NAME_RE.test(precedingText)) continue

    numbers.push({ index, value: Number(raw) })
  }
  return numbers
}

// A tight, comma-only-separated run of 3+ bare numbers — the "walked
// series" shape ("from W35 through W42: -66, -50, -40, -30, -18, -8, -5,
// 0.", real text from alice-layout-recovery.mdx) rather than a single
// (week, score) citation. Proximity alone can't tell which list position
// belongs to which W-token (the first listed value sits physically closest
// to *both* tokens in a "from X through Y: <list>" sentence, even though it
// semantically belongs only to X) — that per-position resolution is exactly
// the "N weeks ago" / streak-walking sub-shape that's chunk 01.3's job, out
// of scope here. Detecting the list shape and skipping it entirely (for
// every W-token in the sentence) avoids guessing wrong.
const NUMBER_SEQUENCE_RUN_RE = /(?:[+-]?\d+(?:\.\d+)?\s*,\s*){2,}[+-]?\d+(?:\.\d+)?/

// Requires an explicit "score" stem somewhere in the sentence before a
// citation is even attempted. The real corpus's `W\d\d`-adjacent numbers
// are frequently about a *different* metric entirely — concurrent
// group-buy counts, sparkline positions, percentages — not the row's
// tracker score (e.g. prototypist-vendor-spotlight.mdx's alt text: "19 in
// W20, 6 in W22, ... and 2 in W30" is a count of concurrent group buys,
// not a score, even though it has the same "name ... W-token ... number"
// shape as a real score citation). It also incidentally guards against a
// same-week *comparison* between two rows where only one's full name
// literally matches (gmk-cyl-ta-neo-production-tracking.mdx: "TA Neo's
// peak of 62 outscored GMK CYL OG Extensions' 58" — "outscored" does NOT
// satisfy this word-bounded pattern, so the whole ambiguous sentence is
// skipped rather than risk pairing the wrong switch's number with the one
// name that does resolve). Word-bounded on purpose for that reason.
const SCORE_CUE_RE = /\bscores?\b|\bscoring\b|\bscored\b/i

// Case-insensitive, word-boundary-tolerant substring search for a trend
// row's exact `name` field in the body. Deliberately literal (no fuzzy
// normalization of spacing/punctuation inside the name) — the task's own
// calibration example ("Alice layout" in prose vs. the record's `name`)
// is a literal match, and erring toward "no mention found → skip" over
// a fuzzy match that might misfire is the same conservative posture as
// the rest of this check. A regex-based `\b...\b` isn't used here because
// several real row names end in a non-word character (e.g. "Cherry (MX +
// XTRFY)"), which would make \b fail to match the trailing boundary
// entirely when followed by whitespace; this does the boundary check by
// hand instead so matching doesn't silently depend on the name's shape.
function findRowNameMentions(body, name) {
  const mentions = []
  if (!name) return mentions
  const lowerBody = body.toLowerCase()
  const lowerName = name.toLowerCase()
  const isWordChar = (ch) => !!ch && /[a-z0-9]/i.test(ch)
  let idx = 0
  while ((idx = lowerBody.indexOf(lowerName, idx)) !== -1) {
    const before = idx > 0 ? body[idx - 1] : ''
    const after = idx + lowerName.length < body.length ? body[idx + lowerName.length] : ''
    const matchEnd = idx + lowerName.length
    // Exclude a mention that's only the clickable text of a markdown link
    // to a *different* article — "...attention shifts to the [GMK CYL OG
    // Extensions](/article/gmk-cyl-og-extensions-interest-check) interest
    // check" (real text, gmk-cyl-ta-neo-production-tracking.mdx) is a
    // "related reading" cross-reference, not a claim that this sentence's
    // number is about that row.
    const isLinkLabel = before === '[' && body.slice(matchEnd, matchEnd + 2) === ']('
    if (!isLinkLabel && !isWordChar(before) && !isWordChar(after)) {
      mentions.push(idx)
    }
    idx += lowerName.length
  }
  return mentions
}

// Resolves a 2-digit ISO week number to a data/trends/<YYYY-Www>.json file,
// trying the given nominal year first and then adjacent years — a given
// calendar week can land in an archived file under a neighboring year at
// a year boundary, and some content (e.g. a file with no parseable
// publish date) has no nominal year to anchor on at all. Best-effort: if
// no year yields an existing, parseable file, returns null and the caller
// skips that citation silently (mirrors how the switch check skips an
// unresolvable switch slug).
const YEAR_SEARCH_OFFSETS = [0, -1, 1, -2, 2]

function listTrendYears() {
  try {
    const years = new Set()
    for (const f of readdirSync(TRENDS_DIR)) {
      const m = f.match(/^(\d{4})-W\d{2}\.json$/)
      if (m) years.add(Number(m[1]))
    }
    return Array.from(years).sort((a, b) => a - b)
  } catch {
    return []
  }
}

function resolveTrendWeek(weekNum, nominalYear) {
  const weekStr = String(weekNum).padStart(2, '0')
  const candidateYears =
    typeof nominalYear === 'number'
      ? YEAR_SEARCH_OFFSETS.map((offset) => nominalYear + offset)
      : listTrendYears()

  for (const year of candidateYears) {
    const isoWeek = `${year}-W${weekStr}`
    const filePath = join(TRENDS_DIR, `${isoWeek}.json`)
    if (!existsSync(filePath)) continue
    try {
      const data = JSON.parse(readFileSync(filePath, 'utf8'))
      if (!Array.isArray(data.rows)) continue
      return { isoWeek, rows: data.rows }
    } catch {
      // Malformed trend file — best-effort, try the next candidate year.
    }
  }
  return null
}

// For each `W\d\d` token in the body, resolves the week (via `resolveWeek`,
// injected so this stays unit-testable without touching disk) and the
// nearest numeric score citation AND named row — both gated to the *same
// sentence* as the token (see segmentSentenceBoundaries). Same-sentence is
// a much tighter guard than the switch check's "same sentence, else
// nearest anywhere in the article" fallback: the newsletter corpus this
// check also runs against is dense with unrelated numbers (dates,
// percentages, other weeks' scores in the same recap), so widening the
// search to "nearest anywhere in the doc" risks pairing a week token with
// a number several sections away. Returns an array of mismatch records.
function findTrendScoreMismatches(body, resolveWeek) {
  const boundaries = segmentSentenceBoundaries(body)
  const numbers = findTrendScoreNumbers(body)
  const mismatches = []

  // First pass: count how many times each distinct week number occurs per
  // sentence. A repeated token in one sentence ("...scores climbing from
  // 55 in W21 to 76 in W25, with a vertical marker at W21 labeled Computex
  // 2026" — real text, computex-2026-keyboard-highlights.mdx) is usually a
  // chart-annotation callback to the SAME citation, not a second
  // independent claim — but naive nearest-number-to-token attribution
  // would otherwise pull the *other* token's number toward this repeat
  // occurrence. There's no reliable way to tell "annotation echo" apart
  // from "a second, genuinely different claim at the same week" by
  // proximity alone, so every occurrence of a week number repeated within
  // one sentence is skipped rather than guessed.
  const weekCountBySentence = new Map() // sentenceIndex -> Map(weekNum -> count)
  {
    WEEK_TOKEN_RE.lastIndex = 0
    let m
    while ((m = WEEK_TOKEN_RE.exec(body)) !== null) {
      const sentence = sentenceIndexAt(boundaries, m.index)
      const weekNum = Number(m[1])
      if (!weekCountBySentence.has(sentence)) weekCountBySentence.set(sentence, new Map())
      const counts = weekCountBySentence.get(sentence)
      counts.set(weekNum, (counts.get(weekNum) || 0) + 1)
    }
  }

  // Second pass: count distinct candidate score-numbers per sentence, to
  // compare against each sentence's distinct week count below.
  const numberCountBySentence = new Map() // sentenceIndex -> count of candidate numbers
  for (const num of numbers) {
    const sentence = sentenceIndexAt(boundaries, num.index)
    numberCountBySentence.set(sentence, (numberCountBySentence.get(sentence) || 0) + 1)
  }

  WEEK_TOKEN_RE.lastIndex = 0
  let tokenMatch
  while ((tokenMatch = WEEK_TOKEN_RE.exec(body)) !== null) {
    const weekNum = Number(tokenMatch[1])
    const tokenIndex = tokenMatch.index
    const tokenSentence = sentenceIndexAt(boundaries, tokenIndex)
    const sentenceStart = boundaries[tokenSentence]
    const sentenceEnd = tokenSentence + 1 < boundaries.length ? boundaries[tokenSentence + 1] : body.length
    const sentenceText = body.slice(sentenceStart, sentenceEnd)

    if (weekCountBySentence.get(tokenSentence).get(weekNum) > 1) continue // repeated token in-sentence — ambiguous, see note above.
    if (NUMBER_SEQUENCE_RUN_RE.test(sentenceText)) continue // walked-series shape — skip, not this chunk's job.
    if (!SCORE_CUE_RE.test(sentenceText)) continue // no "score" cue — likely a different metric or an unresolvable comparison.
    // More candidate numbers than distinct weeks referenced in the
    // sentence means there are more claims than anchors to pin them to —
    // e.g. "Mode Designs is the week's notable decliner, down to 72 after
    // peaking at 98 two weeks back" (thock-weekly-012.mdx) names one week
    // (W42) but has two numbers (the current 72 and the two-weeks-back
    // 98), and raw proximity happens to put the *older* number physically
    // closer to the token. There's no reliable way to tell which number
    // the lone token actually anchors, so skip the whole sentence.
    const distinctWeeksInSentence = weekCountBySentence.get(tokenSentence).size
    if ((numberCountBySentence.get(tokenSentence) || 0) > distinctWeeksInSentence) continue

    let nearestNumber = null
    for (const num of numbers) {
      if (sentenceIndexAt(boundaries, num.index) !== tokenSentence) continue
      const dist = wordDistance(body, tokenIndex, num.index)
      if (!nearestNumber || dist < nearestNumber.distance) {
        nearestNumber = { value: num.value, index: num.index, distance: dist }
      }
    }
    if (!nearestNumber || nearestNumber.distance > WEEK_SCORE_WINDOW_TOKENS) continue

    const resolved = resolveWeek(weekNum)
    if (!resolved) continue // unresolvable week file — best-effort, skip silently.

    let nearestRow = null
    for (const row of resolved.rows) {
      if (typeof row.name !== 'string') continue
      for (const nameIndex of findRowNameMentions(body, row.name)) {
        if (sentenceIndexAt(boundaries, nameIndex) !== tokenSentence) continue
        const dist = wordDistance(body, nearestNumber.index, nameIndex)
        if (!nearestRow || dist < nearestRow.distance) {
          nearestRow = { row, distance: dist }
        }
      }
    }
    if (!nearestRow || nearestRow.distance > WEEK_SCORE_WINDOW_TOKENS) continue

    const { row } = nearestRow
    if (typeof row.score === 'number' && row.score !== nearestNumber.value) {
      mismatches.push({
        isoWeek: resolved.isoWeek,
        rowName: row.name,
        foundValue: nearestNumber.value,
        expectedValue: row.score,
        index: tokenIndex,
      })
    }
  }

  return mismatches
}

// ── Content file resolution (articles + newsletters) ──────────────────────────

// Parses the article's/newsletter's nominal publish year off its
// frontmatter `publishedAt` or `date` field (whichever is present), used to
// anchor resolveTrendWeek's year search. Returns null when neither field is
// present or parseable — resolveTrendWeek falls back to trying every year
// that actually has trend data on disk.
function extractNominalYear(frontmatterText) {
  const m = frontmatterText.match(/^(?:publishedAt|date):\s*['"]?(\d{4})-/m)
  return m ? Number(m[1]) : null
}

// Resolves a content file's mentionedParts switch entries against
// data/switches/*.json (switch spring-weight citations, chunk 01.1) and its
// `W\d\d` tracker-week tokens against data/trends/*.json (tracker-score
// citations, chunk 01.2), finding numeric mismatches in its body either way.
// `dir` is 'articles' or 'newsletters' — carried on each mismatch so
// formatAuditRow/describeMismatch can point at the right content path.
// Returns { slug, mismatches } — mismatches is [] when clean. Throws only on
// a problem with the file itself; a missing/malformed individual switch or
// trend-week record is skipped (best-effort), not fatal.
function checkContentFile(filePath, dir) {
  const content = readFileSync(filePath, 'utf8')
  const slug = basename(filePath, '.mdx')
  const frontmatterText = extractFrontmatterText(content)
  const { body } = extractBody(content)
  const mentionedParts = parseMentionedParts(frontmatterText)

  const mismatches = []

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
  if (switchesWithParts.length > 0) {
    for (const m of findNumericMismatches(body, switchesWithParts)) {
      mismatches.push({ ...m, kind: 'switch', dir })
    }
  }

  const nominalYear = extractNominalYear(frontmatterText)
  const resolveWeek = (weekNum) => resolveTrendWeek(weekNum, nominalYear)
  for (const m of findTrendScoreMismatches(body, resolveWeek)) {
    mismatches.push({ ...m, kind: 'trend-score', dir })
  }

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
  if (m.kind === 'trend-score') {
    return `${m.rowName} cited at ${m.foundValue} for ${m.isoWeek}, but data/trends/${m.isoWeek}.json's rows[].score for that row is ${m.expectedValue}`
  }
  if (m.field === 'unspecified') {
    return `${m.switchName} cited at ${m.foundValue}g, but data/switches/${m.switchSlug}.json has neither actuation (${m.expectedActuation}g) nor bottomOut (${m.expectedBottomOut}g) at that value`
  }
  return `${m.switchName} ${m.field} cited at ${m.foundValue}g, but data/switches/${m.switchSlug}.json's springGrams.${m.field} is ${m.expectedValue}g`
}

// Trend-score mismatches get their own claimKey shape (prefixed `:trend:`)
// so they can never collide with a switch-citation dedup key on the same
// slug, even if the two checks happened to produce the same foundValue.
function claimKey(slug, m) {
  if (m.kind === 'trend-score') {
    return `${slug}:trend:${m.isoWeek}:${m.rowName}:${m.foundValue}`
  }
  return `${slug}:${m.switchSlug}:${m.field}:${m.foundValue}`
}

function formatAuditRow(slug, mismatch, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const dir = mismatch.dir || 'articles'

  if (mismatch.kind === 'trend-score') {
    return `\n### [ ] [content] [3.6] ${slug} — ${mismatch.rowName} tracker-score citation disagrees with data/trends/${mismatch.isoWeek}.json
- category: content
- filed: ${todayStr} by content-fact-audit.mjs — ${claimKey(slug, mismatch)}
- impact: 4 (factual-accuracy mismatch on published content)
- ease: 9 (one-line prose correction once the mismatch is found)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/${dir}/${slug}.mdx
- claim: ${describeMismatch(mismatch)}
- action: correct the prose citation to match data/trends/${mismatch.isoWeek}.json's rows[].score (or correct the data record if the data is the one that's wrong)\n`
  }

  return `\n### [ ] [content] [3.6] ${slug} — ${mismatch.switchName} spring-weight citation disagrees with data/switches/${mismatch.switchSlug}.json
- category: content
- filed: ${todayStr} by content-fact-audit.mjs — ${claimKey(slug, mismatch)}
- impact: 4 (factual-accuracy mismatch on published content)
- ease: 9 (one-line prose correction once the mismatch is found)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/${dir}/${slug}.mdx
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
  checkNewsletter,
  checkContentFile,
  extractNominalYear,
  findTrendScoreNumbers,
  findRowNameMentions,
  resolveTrendWeek,
  findTrendScoreMismatches,
  formatAuditRow,
  describeMismatch,
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

let articleFiles
try {
  articleFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))
} catch (err) {
  console.error(`content-fact-audit: failed to read articles dir — ${err.message}`)
  process.exit(1)
}

let newsletterFiles
try {
  newsletterFiles = readdirSync(NEWSLETTERS_DIR).filter((f) => f.endsWith('.mdx'))
} catch (err) {
  console.error(`content-fact-audit: failed to read newsletters dir — ${err.message}`)
  process.exit(1)
}

const targets = [
  ...articleFiles.map((file) => ({ file, dir: 'articles', filePath: join(ARTICLES_DIR, file) })),
  ...newsletterFiles.map((file) => ({
    file,
    dir: 'newsletters',
    filePath: join(NEWSLETTERS_DIR, file),
  })),
]

// Best-effort: a single article/newsletter that fails to parse is logged
// and skipped, never crashes the whole run with a raw stack trace.
const results = []
for (const { file, dir, filePath } of targets) {
  try {
    results.push(checkContentFile(filePath, dir))
  } catch (err) {
    console.error(`content-fact-audit: skipped ${dir}/${file} — ${err.message}`)
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
    console.log(`content-fact-audit: mismatch in ${m.dir}/${m.slug}.mdx — ${describeMismatch(m)}`)
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
  console.log(`MISMATCH ${m.dir}/${m.slug}.mdx — ${describeMismatch(m)}`)
}

console.error(
  `content-fact-audit: ${allMismatches.length} numeric citation mismatch(es) found — run with --write to file AUDIT rows.`,
)
process.exit(1)

} // end isMain
