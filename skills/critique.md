# Skill: critique

> **External observer.** The skill that visits the live site as a
> first-time reader, takes notes, self-assesses the notes, and
> appends durable findings to `plan/CRITIQUE.md`. `/iterate` reads
> CRITIQUE.md as a finding source and ships fixes — that's the
> "address loop" half.
>
> Not invoked every tick. Invoked **periodically** (every ~12
> commits, at most once per 24h, only against a green deploy) by
> `/march`, or **on demand** by the user when they want a fresh
> pass.

## 1. Purpose

The autonomous loop is good at shipping what it was told to ship.
It's bad at noticing when the shipped result doesn't read well as
a real reader would experience it.

`/critique` is the corrective lens. It deliberately introduces
friction — one more category of audit findings, one more bias
the loop has to weigh — but the friction is bounded:

- One pass per invocation.
- Cap of 8 findings per pass.
- Findings score against the same `impact × ease` rubric `/iterate`
  uses, so they compete fairly with content gaps, link rot, etc.
- Never blocks the build plan; never modifies code.

## 2. Invocation

```
/critique                    # full pass — visit ~6 URLs
/critique <url>              # focused pass on one URL
/critique mobile             # 375×800 viewport only
/critique desktop            # 1280×800 only
/loop /critique              # only meaningful with a long delay; prefer /march
```

When invoked from `/march` (the typical case), `/march` has
already checked that conditions are right — site is live, last
pass was long enough ago, etc.

## 3. The page set (default full pass)

Pick representative pages, not exhaustive ones. The smoke walker
already covers every URL; critique is for *quality*, not
*existence*.

| Page | Why critique it |
|---|---|
| `/` (home) | First impression. The fold matters. |
| `/article/<latest-published>` | Canonical reading experience. |
| `/trends` (pillar landing) | Pillar voice + card cascade. |
| `/trends/tracker` | Signature feature — it must feel insightful. |
| `/group-buys` | Time-sensitive content; urgency without doom-bar. |
| `/tag/<top-tag-by-count>` | Faceted browse path. |

If the build hasn't reached one of these phases yet (e.g. phase
is < 8 so `/trends/tracker` doesn't exist), skip that URL and
note in the pass log.

## 4. Delegate to `reader`

The `reader` sub-agent at `.claude/agents/reader.md` is the actual
fresh-eyes observer. **Always delegate the visit to it.** Reasons:

- It has browser tools (`mcp__claude-in-chrome__*`) that produce
  richer findings than WebFetch.
- A fresh sub-agent context = genuine first-time-reader perspective
  (your context is full of build-plan knowledge that biases what
  you'd notice).
- Its output is structured JSON; easy to filter and file.

Pass it:

- The URL list.
- The voice cue from `plan/bearings.md` (mono accent, knowledgeable
  peer, dark-mode editorial).
- The current `plan/CRITIQUE.md` Done section so it doesn't
  re-surface addressed findings.
- Any focus areas from the invocation argument.

It returns a JSON array of findings. You take it from there.

## 5. The procedure

### Step 0 — Pre-flight

```bash
git pull --ff-only
pnpm deploy:check
```

If `pnpm deploy:check` exits non-zero (no green deploy yet), defer:
write a one-line entry to `plan/CRITIQUE.md` saying "deferred at
<date>: no green deploy" and exit 0. **Do not commit if no
findings change** — append-only files don't grow on no-ops.

### Step 1 — Build the page set

Default to §3. Adjust based on:

- Argument (specific URL, `mobile`, `desktop`).
- Phase progress — skip pages that don't exist yet.
- Recent shipping focus — if the last 5 commits all touched
  `/trends`, weight that surface.

### Step 2 — Spawn `reader`

```
Agent({
  subagent_type: "reader",
  prompt: "Visit these URLs of https://thock.netlify.app: [list].
           Voice cue from plan/bearings.md: <quote relevant section>.
           Already-addressed findings (skip these): <Done section
           from plan/CRITIQUE.md>.
           Focus: <from arg, or 'general'>.
           Return ≤ 8 findings as JSON per your output spec."
})
```

Wait for return. Reader returns a JSON array.

### Step 3 — Self-assess

This is the assessment step the user explicitly called out.
Reader returns observations; you decide which deserve to land.

For each finding from reader, ask:

1. **Is it valid?** Can the evidence be re-verified by another
   reader? If only reader's specific browser session would see
   it (cached bug, dev tab open), drop it.
2. **Is it actionable?** Can a future `/iterate` tick fix it
   with the resources at hand (no design rework, no schema
   migration, no external dependency)? If not, file as
   `[needs-user-call]` with severity but don't expect iterate to
   pick it up.
3. **Is it a duplicate?** If `plan/CRITIQUE.md` already has an
   open row for this exact issue (same URL + same category +
   similar observation), drop the new finding and bump the older
   one's severity if reader saw it again.
4. **Does the severity match the impact?** Reader is honest but
   sometimes overweights cosmetic issues. Re-rate if needed.
5. **Is the suggested fix sane?** If the suggestion contradicts
   `bearings.md` standing decisions or the URL contract, replace
   it with a fix that's compatible.

After assessment, you should have **3–6 findings**, not 8. If
reader returned 8 and you kept all 8, you didn't assess.

### Step 4 — Append to `plan/CRITIQUE.md`

Format:

```markdown
# Critique log

> Last pass: 2026-05-08T14:32:00Z at commit abc1234
> Pass count: 3
> Iterate-bias category: external-critique  (set automatically by march; cleared by oversight)

## Pending

### [HIGH] /trends/tracker — direction glyphs hard to distinguish at row size
- pass: 3 (commit abc1234)
- viewport: desktop
- category: visual
- observation: up/down arrows are 12px, similar shape — at a
  glance the rail reads as static.
- evidence: screenshot region of `/trends/tracker` shows three
  consecutive rows where the arrow type is ambiguous without
  hover.
- suggested fix: bump glyph to 16px, or add a 1ch color slug
  (accent-up / accent-down).
- source: browser

### [MED] / — mobile hero text wraps awkwardly at 375px
- ...

## Done

### [x] [MED] /article/<slug> — read-time clamp shows "0 min read" on short articles  (pass 2; addressed at commit deadbeef)
- ...
```

Update the metadata header (`Last pass`, `Pass count`, today's
date in ISO).

### Step 5 — Commit + push

```bash
git add plan/CRITIQUE.md
git commit -m "$(cat <<'EOF'
critique: pass <N> — <K> findings (<H> high, <M> medium, <L> low)

Visited: <list of URLs>.
Findings filed to plan/CRITIQUE.md Pending section.
Address loop: /iterate will pick the highest-scoring finding.
EOF
)"
git push origin main
```

If you produced **zero** findings (rare, but possible — site is
clean), still update the metadata header (`Last pass`, `Pass
count`) and commit `critique: pass <N> — no findings`. The pass
counter and the Last-pass timestamp are the signal `/march` reads
to decide when next to fire.

### Step 6 — Confirm deploy

```bash
pnpm deploy:check
```

Same as every shipping skill. A doc-only push should not break
anything; if it does, that's a real signal.

### Step 7 — Done

Return a 3-line summary:

```
critique pass <N> complete: <K> findings, <H> high.
plan/CRITIQUE.md updated.
ready for /iterate to drain the queue.
```

## 6. Hard rules

1. **Never modify code, content, or data.** Findings only.
2. **Always delegate the visit to `reader`.** Don't visit the site
   from the main agent's context — the fresh-eyes contract requires
   a clean sub-agent context.
3. **Self-assess after reader returns.** Don't file raw observations.
4. **Cap at 6 filed findings per pass** (after assessment). 8 is
   reader's input cap; 6 is your output cap. Filtering happens.
5. **Never duplicate Pending or Done entries.** Cross-reference
   first.
6. **One commit per pass.** Subject `critique: pass <N> — …`.
7. **No emojis. No `Co-Authored-By:`.** Carry over.

## 7. Failure modes

1. **No green deploy.** Defer (per Step 0). The skill exits 0
   with a deferred-pass log entry; the loop continues.
2. **`reader` returns malformed output.** Re-spawn once with a
   stricter format reminder. If it fails again, write a single
   finding "reader sub-agent malfunction at pass <N>", commit,
   exit 1.
3. **No URLs left in the page set** (very early phases). Defer.
4. **`git pull` divergence.**
5. **Browser tools unavailable AND WebFetch produces no
   actionable findings** (e.g. fully-rendered HTML reveals no
   issues). Log "no findings, web-fetch only", commit, exit 0.

## 8. The address loop (how `/iterate` picks up critique findings)

This is the contract `/iterate` honors:

- `plan/CRITIQUE.md`'s `## Pending` section is the queue.
- Each finding has `severity` (high|medium|low) and an implied
  ease from `suggested fix` length / specificity.
- `/iterate` §4 maps each Pending finding to a finding in its
  audit, category `external-critique`:
  - severity high → impact 8–10
  - severity medium → impact 5–7
  - severity low → impact 2–4
  - ease scored from suggested-fix complexity (one-line edit = 9;
    multi-file = 6; new component = 4)
- When `/iterate` ships a fix for a critique finding, it moves
  the row from `## Pending` to `## Done` with a `[x]` marker, the
  pass number, and the addressing commit hash.

This means **critique findings compete fairly** with other audit
sources. A high-severity content gap can outrank a low-severity
critique nitpick — and vice versa. The loop self-balances.

## 9. When `/march` invokes `/critique`

`/march` reads the metadata header at the top of
`plan/CRITIQUE.md`:

```
> Last pass: <ISO-date> at commit <sha>
> Pass count: <N>
```

Conditions for `/march` to dispatch `/critique` instead of the
normal flow:

1. Latest commit is **at least 12 commits** after the `Last pass`
   commit, OR the `Last pass` is **more than 24 hours** ago.
2. `pnpm deploy:check` shows a green deploy (no point critiquing
   a red site).
3. A `/iterate` or `/ship-data` tick is the next dispatch (we
   don't pre-empt phase shipping).

If all three hold, `/march` calls `/critique` for that tick. The
next tick after critique resumes normal dispatch.

## 10. Quick reference

```bash
# Read
plan/bearings.md                    # voice cue for reader
plan/CRITIQUE.md                    # current Pending + Done
plan/AUDIT.md                       # for cross-checking duplicates

# Sub-agent
Agent({ subagent_type: "reader", prompt: "..." })

# Write
plan/CRITIQUE.md                    # the only file critique modifies

# Commit + push + confirm
git add plan/CRITIQUE.md
git commit -m "critique: pass <N> — ..."
git push origin main
pnpm deploy:check
```
