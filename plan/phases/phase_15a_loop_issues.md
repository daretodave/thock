# Phase 15a — Loop issues mirror

> Agent-facing brief. Concise, opinionated, decisive. Adds a public
> issue-lifecycle to the autonomous loop: when `/iterate` picks a
> finding to ship, open a GitHub issue first; close it via the
> commit's `Closes #N` trailer. **Inserts** between phase 15 and
> phase 16 — slots ahead of phase 16 so polish ships under the new
> flow.

## Why

Today's loop is opaque from outside the repo:

- `/jot` and `/critique` write findings to `plan/CRITIQUE.md` (a
  private working file).
- `/iterate` ships fixes and ticks the row from Pending → Done in
  the same private file.
- The only public surface is `/triage` — and it only handles
  **inbound** user-filed issues (none today; one closed crash issue
  on the repo at the time of this brief).

That hides the loop's work. The repo's GitHub issue tab should be
a live timeline of "what the loop is doing right now": opened
when work starts, closed when the commit lands.

User-facing decision (`/oversight` 2026-05-09 via question prompt):

- **Mirror at fix-time** — issue creation is gated on `/iterate`
  picking the finding to ship. No issue per /jot, no issue per
  /critique row. Issues track *deliveries*, not the backlog. High
  signal, low noise.
- **No Project (v2) board** — issues are enough timeline. Skip the
  `gh auth refresh -s project` step.

## Scope (what ships in this phase)

1. New helper module: `scripts/loop-issue.mjs` — a thin Node CLI
   wrapping `gh` for the two operations the loop needs (`open`,
   `close-comment`).
2. `skills/iterate.md` — Step 3a (open issue) inserted between
   "Pick the work" and "Delegate or implement"; Step 5 (commit)
   gains a `Closes #N` trailer; Step 7 (deploy confirmation) gains
   a follow-up `gh issue comment` with the deploy URL.
3. `skills/jot.md` — §5 ("How /jot flows into thock's loop") gains
   a paragraph noting that the issue appears at fix-time, not
   jot-time. No code change to the jot procedure.
4. `skills/critique.md` — §5 (procedure) gains a parallel note;
   reader findings remain private until /iterate picks one.
5. `skills/triage.md` — §5 Step 1 (List candidates) excludes
   loop-opened issues by an additional label filter, so they
   don't get re-triaged.
6. CRITIQUE.md / AUDIT.md row schema — finding rows gain an
   optional `- issue: #N` field, populated when /iterate opens an
   issue. Rows already in flight at ship time of this phase do
   **not** get retroactively mirrored — natural attrition is
   simpler than backfilling.
7. Standing labels — auto-create on first use:
   - `loop:opened` (the loop opened this; skip in /triage)
   - `severity:high` / `severity:med` / `severity:low`
   - `source:user` (was /jot) / `source:reader` (was /critique) /
     `source:audit` (was /iterate's own audit) /
     `source:external` (was /triage routing a user-filed issue)
   - Existing thock category labels (`bug`, `enhancement`,
     `content`, `data`, `docs`, `seo`, `a11y`, `perf`) — keep as-is.

## Out of scope (explicit non-goals)

- **No Projects v2 integration.** No PAT scope refresh required;
  `repo` already covers issue create/comment/close.
- **No issue per /jot.** /jot stays the 5-second decide-and-ship
  capture path.
- **No retroactive backfill.** The 4 currently-pending CRITIQUE
  rows remain private; they get issues if and when /iterate picks
  them, same as new findings.
- **No close-the-loop for phase commits absorbing /jot rows.**
  Phase work that happens to drain a low-severity jot does not
  open an issue — there was no public artifact to close.
- **No Buttondown or analytics changes.** Phase 15 just shipped
  those; this phase is loop infrastructure only.
- **No `ship-data` / `ship-asset` / `ship-a-phase` issue mirror.**
  Issues are an `/iterate`-shaped concept (one finding → one fix).
  Phase work and data adds remain non-mirrored. If we later want
  to mirror phase work, it's a fresh phase.

## The helper: `scripts/loop-issue.mjs`

Single Node script (no deps; `child_process.execSync` shells out
to `gh`). Reads `GH_TOKEN` and `GH_REPO` from `.env` if not in
env, the same shape `skills/triage.md` §3 uses.

### Usage

```bash
# Open an issue for a finding. Echoes the new issue number to stdout.
node scripts/loop-issue.mjs open \
  --severity high \
  --category content \
  --source reader \
  --title "tag/[slug] — back-link lies about its destination" \
  --body-file /tmp/loop-issue-body.md
# stdout: 42

# Post a follow-up comment after deploy:check turns green.
node scripts/loop-issue.mjs close-comment \
  --number 42 \
  --commit a3f1e2c \
  --deploy-url https://thock-coral.vercel.app
# (Closing happens automatically via the "Closes #42" trailer in the commit body.)
```

### Behavior

- `open`:
  1. Loads `.env` if `GH_TOKEN` is missing from env.
  2. Ensures all needed labels exist (`gh label create ... 2>/dev/null || true` per label).
  3. `gh issue create` with the assembled body, labels:
     `loop:opened`, `severity:<x>`, `source:<x>`, `<category>`.
  4. Parses the issue URL from gh's stdout, prints the number.
  5. Exit 0 on success. On any failure, exit 1 with a one-line
     error to stderr — caller falls back to "no issue, just ship".
- `close-comment`:
  1. `gh issue comment <N> --body "Shipped in <commit>. Live at <deploy-url> after deploy ready."`
  2. The `Closes #<N>` commit trailer auto-closes when pushed to
     `main` — no explicit `gh issue close` needed.
  3. Exit 0 on success. Failure prints to stderr but does not exit
     non-zero — the fix already shipped, missing the comment isn't
     fatal.

### Issue body template

The helper does **not** invent prose. Caller passes
`--body-file <path>` with content already shaped:

```markdown
**Source:** /critique pass 2 (reader sub-agent)
**Severity:** HIGH · **Category:** a11y · **URL:** /tag/[slug]

## Observation
<verbatim from finding>

## Evidence
<verbatim from finding>

## Suggested fix
<verbatim from finding>

---
_Tracked by the autonomous loop. The fix lands as a commit with
`Closes #<this-issue>` in the body; this issue auto-closes when
the commit pushes to main._
```

The caller (the iterate skill) builds this from the CRITIQUE/AUDIT
row it just picked.

## Skill changes

### `skills/iterate.md`

**§5 Step 2 — Pick the work** stays as-is.

**Insert §5 Step 2.5 — Mirror to GitHub** (new):

```
### Step 2.5 — Mirror to GitHub

If the picked finding does not already have an `- issue: #N`
field on its row, open one before doing the work:

1. Build the body file (see helper §"Issue body template") from
   the finding's observation/evidence/suggested-fix.
2. Run `node scripts/loop-issue.mjs open ...` with the
   appropriate flags.
3. Capture the number; record it on the finding's row in
   plan/CRITIQUE.md or plan/AUDIT.md as `- issue: #<N>`. Commit
   that row update separately at end of tick (Step 6 — Tick the
   audit) so the row carries the issue number into Done.

If `loop-issue.mjs open` fails (auth, rate limit, network), log
the failure to plan/AUDIT.md as a `[loop-issue-mirror-failed]`
note and continue with the fix. The next tick will retry on the
next finding; do not block delivery.

If the finding already has an `- issue: #N` (e.g., it was filed
externally via /triage and routed in, or a previous iterate tick
opened the issue but failed to ship the fix), skip the open step
and reuse the existing number.
```

**§5 Step 5 — Commit** changes:

- The "If the addressed finding came from /triage..." paragraph
  is generalized: any finding with an `- issue: #N` field gets a
  `Closes #<N>` trailer in the commit body. The /triage path is
  no longer the only way an iterate fix references an issue.
- Example commit body in the skill is updated to include `Closes
  #<N>` as a standard line.

**§5 Step 7 — Confirm deploy** changes:

- After `pnpm deploy:check` is green, run `node
  scripts/loop-issue.mjs close-comment --number <N> --commit
  <sha> --deploy-url <vercel-url>` for each issue closed by the
  commit. Failures here are warnings, not stoppers.

**§7 Hard rules** gains:

> 7. **Issue mirror is best-effort, not gating.** If
>    `loop-issue.mjs` fails, the fix still ships. The mirror is a
>    public timeline, not a verification step.

### `skills/jot.md`

**§5 ("How /jot flows into thock's loop") gains a closing
paragraph:**

> When `/iterate` (or `/march`) picks the jot to ship, the iterate
> skill opens a GitHub issue **at fix-time** (per phase 15a). The
> jot itself does not open an issue — that would dilute the
> issues tab into a noise feed of every spotted thing. The issue
> opens when work starts and closes via the fix commit's
> `Closes #N` trailer. The user sees the work happen on the repo's
> Issues tab. To watch a jot land in real time: `/jot ...` then
> `/iterate`, then watch
> https://github.com/daretodave/thock/issues.

### `skills/critique.md`

**§5 (procedure) Step 4 — Filter findings**: append a sentence
clarifying that filed CRITIQUE.md rows do not become public
issues until `/iterate` drains them, by design. (No code change
to the critique procedure itself.)

### `skills/triage.md`

**§5 Step 1 (List candidates)** — extend the search filter:

```bash
gh issue list \
  --repo "$GH_REPO" \
  --state open \
  --search "-label:triage:loop-queued -label:triage:needs-user -label:triage:closed -label:triage:reviewed -label:loop:opened" \
  --json number,title,body,labels,author,createdAt,updatedAt,comments \
  --limit 50
```

The `-label:loop:opened` clause prevents triage from re-routing
issues that the loop opened on itself; those have a known
provenance and don't need triage labeling.

**§4 Label scheme** gains a one-line note: `loop:opened` is a
provenance label, distinct from the `triage:*` state labels.

## State-row schema additions

CRITIQUE.md and AUDIT.md finding rows already use the format:

```markdown
### [SEVERITY] /url — one-line summary
- pass: ...
- viewport: ...
- category: ...
- observation: ...
- evidence: ...
- suggested fix: ...
- source: ...
```

Phase 15a adds (optional, populated only after first iterate
mirrors the row):

```markdown
- issue: #42
```

When the row moves Pending → Done, the `issue:` line is preserved
so the historical record links to the public issue.

## Tests

Unit:

- `scripts/__tests__/loop-issue.test.mjs` (Node `node:test`):
  1. `open` builds correct `gh issue create` argv from flags
     (mock `execSync`, capture argv, assert label set + body
     piping).
  2. `open` parses the issue number from a fake gh stdout
     (`https://github.com/daretodave/thock/issues/42` → `42`).
  3. `open` exits 1 on `gh` failure and prints to stderr.
  4. `close-comment` builds the comment body from `--commit` and
     `--deploy-url`.
  5. Label-create idempotency: `gh label create` errors on
     already-exists; we swallow that specific error path.
- Wire the new test into `pnpm verify` via the existing test runner.

Skill spec is documentation, not code, so no skill-level test
is needed. The end-to-end behavior is verified by running
`/iterate` once after this phase ships and observing the issue
appear + close on the repo.

## Verify gate

```bash
pnpm verify        # typecheck + unit (incl. new helper test) + e2e
```

The helper is Node-only and not exercised in e2e — the unit test
mocks `gh`. Live exercise happens on the first /iterate tick
after merge.

## Acceptance

- `scripts/loop-issue.mjs` exists, has `open` and `close-comment`
  subcommands, exits cleanly with `--help`.
- `pnpm verify` passes including the new helper test.
- All four skills (iterate, jot, critique, triage) updated per
  this brief; word-diffs reviewed against the brief before
  commit.
- The phase commit body lists every changed file under the same
  `phase 15a` subject.
- After ship, the **next** /iterate tick on the existing pending
  CRITIQUE rows opens an issue on github.com/daretodave/thock and
  closes it with the fix commit's `Closes #N`.

## Commit subject

```
feat: loop issues mirror — phase 15a
```

## Risks / edge cases

- **GH_TOKEN scoping** — already verified `repo` scope is
  sufficient (`gh auth status` shows `repo, gist, read:org,
  admin:public_key, write:packages, delete:packages`). No refresh
  required.
- **Rate limit** — PATs allow 5000 req/hour; one open + one
  comment per /iterate tick is well under. The helper does not
  retry on rate-limit errors; the next tick will.
- **Race vs cloud /march tick** — if a local user runs /iterate
  while a cloud march tick is also running, both might open issues
  on the same finding before the row update commits. Mitigation:
  the iterate skill's Step 0 (`git pull --ff-only`) reads any new
  `issue: #N` field. Worst case is one duplicate issue per ~rare
  collision; the loop's next tick will spot the dup and post a
  "Superseded by #N+1" comment + close. Document the heuristic;
  don't engineer for it.
- **Issue body sensitivity** — findings sometimes quote the live
  page or include URL paths the user might not want public. Today
  the live site is fully public, so this is moot. If a private
  surface ships, revisit before continuing to mirror.

## After this ship

- Phase 16 (Polish) is the next pending phase. /march resumes
  normal dispatch.
- The next /iterate tick draining a CRITIQUE row will be the
  first public observation of the new flow on the issues tab.
