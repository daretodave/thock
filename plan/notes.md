

Walked the archived `data/trends/<week>.json` series as ground truth for
past-week lookups, not each row's own `spark` convenience field — the two
can disagree after the fact (an archived week can be corrected after a
citation was written off the then-current spark snapshot). This is the
drift this chunk exists to catch; three real mismatches surfaced in the
live corpus on a dry run (none written — `--write` wiring is chunk 01.4).

"N weeks ago" claims require a literal "from <value> ... weeks ago/back/
earlier" shape (or "from <value> last week" as a special-cased N=1); the
streak-length shape only covers "first gain/rise/increase|drop/decline/
fall in N weeks" — both narrower than the full English-language space on
purpose, matching 01.1/01.2's conservative "skip rather than guess" bar.

Row identity for both new checks resolves off the content file's own
*current* nominal week (from frontmatter `publishedAt`/`date` via
`iso-week.mjs`'s `isoWeekString`), not a same-sentence `W\d\d` token —
the real corpus's "ago" sentences usually don't carry one.

heading-semantics-coverage-check.mjs's sibling sweep (any
`apps/web/src/components/**` file outside the curated list) is
genuinely live, not a stub — it flags two real pre-existing a11y
gaps today: `components/compare/SuggestedSwitchPairs.tsx:27`
(`{a.name} vs {b.name}` inside a bare `<Link>`) and
`components/sources/SourceCounts.tsx:120`
(`{article.frontmatter.title}` inside a bare `<Link>`). Gate mode
against the live corpus exits 1, not 0, as a result. Chunk 12.2's
planned test ("runs gate mode against the real apps/web/src tree
and asserts exit 0 today") will fail as written until one of: (a)
these two components get their title text wrapped in a heading
(the same `<h2>`/`<h3>` pattern the four precedent fixes used), or
(b) 12.2's test scope narrows to the curated list only (which is
clean) rather than the full live tree. Neither is a scanner
defect — both hits are correct per the heuristic and per manual
reading of the code.
