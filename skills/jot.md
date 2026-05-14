# Skill: jot

> **The user's quickfire for thock.** You spotted something
> on the live site. You drop a note. The skill writes one row
> to `plan/CRITIQUE.md`, commits, pushes, and exits in
> seconds. The next time `/iterate` runs, your jot competes
> with every other finding on impact × ease and almost
> certainly wins (user-source findings carry a `+0.5` score
> bump — see `skills/iterate.md` Scoring section).
>
> **Decide-and-ship.** No questions back. No `AskUserQuestion`.
> Hard rule #6 (only `/oversight` asks the user anything)
> stands intact — `/jot` consumes user input via the
> slash-command argument, same shape as `/ship-data add ...`.

## 1. Purpose

You're reading thock at https://thock.xyz, or
clicking through during a `pnpm dev` session, and you spot
something — footer padding too tight, a switch name that
should be in mono but renders as body text, the trends-tracker
empty state looks broken, the lede on `/article/<slug>` is
buried under a hero block.

You don't want a full `/oversight` session for it. You also
don't want to forget it.

`/jot` is the 5-second capture path. The note lands in
`plan/CRITIQUE.md` (where `/critique`'s `reader` sub-agent
files findings), formatted the same way, so `/iterate`'s
existing drainage logic just works.

## 2. Invocation

```
/jot <free-text observation>
/jot --url <path> <text>              # attach the URL you were on
/jot --severity high <text>           # high (jumps the iterate queue)
/jot --severity low <text>            # low (drains when nothing else is pending)
/jot --category <category> <text>     # explicit category override
/jot --authenticated <text>           # tag as observed while logged in (thock's surface is currently public; harmless to omit)
```

Examples in the thock idiom:

```
/jot footer padding too tight on /article pages
/jot --url /trends/tracker the empty state looks broken
/jot --severity high mobile nav at 375px has no toggle
/jot --category content the trends pillar lede is buried
/jot --url /article/gateron-oil-king-deep-dive [unknown part:oil-king] is leaking again
```

## 3. Autonomy contract

- **Never ask questions.** The user provided the input;
  decide the rest.
- **Always commit and push.** Atomic. Otherwise the cloud
  /march tick can't see the new finding.
- **Never run the verify gate.** No code change; nothing to
  verify.
- **Never run the deploy gate.** No deploy needed.
- **Be fast.** Target end-to-end <10 seconds.

## 4. The procedure

### Step 0 — Re-sync

```bash
git pull --ff-only
```

The cloud /march tick may have written to
`plan/CRITIQUE.md`. Always pull before append.

### Step 1 — Parse the argument

Strip the `--flag value` pairs from the front of `$ARGUMENTS`;
the rest is the **observation text**.

| Flag | Purpose | Default if absent |
|---|---|---|
| `--url <path>` | URL the user was on | `unspecified` |
| `--severity <high\|med\|low>` | severity of the issue | `med` |
| `--category <cat>` | explicit category override | infer from text (heuristic below); fallback `observation` |
| `--authenticated` | observed while logged in | `auth_state: anonymous` |

**Category inference heuristics** (loose; just pick something
reasonable):

- Contains "padding", "spacing", "alignment", "color", "font",
  "size", "layout", "mono", "italic" → `visual`
- Contains "link", "click", "go to", "back", "menu", "nav",
  "breadcrumb" → `navigation`
- Contains "mobile", "375", "phone" → `mobile`
- Contains "load", "slow", "spin", "freeze" → `performance`
- Contains "alt", "focus", "keyboard", "screen reader" → `a11y`
- Contains "title", "meta", "OG", "preview", "share" → `seo`
- Contains "voice", "tone", "wording", "copy", "lede" → `voice`
- Contains "article", "post", "missing", "stub", "data",
  "switch", "keycap", "vendor", "group buy" → `content`
- Otherwise → `observation`

Don't overthink. The user can override with `--category`.

### Step 2 — Build the row

Format identical to a `reader` finding so `/iterate`'s
drainage logic doesn't need any new code:

```markdown
### [<SEVERITY-UPPER>] <url-or-"general"> — <one-line summary derived from observation, ≤ 60 chars>
- pass: user-jot (commit <git rev-parse HEAD>)
- viewport: unspecified
- auth_state: anonymous | authenticated
- category: <inferred-or-overridden>
- observation: <the user's text, verbatim, single line>
- evidence: user-spotted at <ISO timestamp>
- suggested_fix: [user has not specified — iterate to determine]
- source: user
```

Append to the **Pending** block of `plan/CRITIQUE.md`.

`plan/CRITIQUE.md` already exists in thock with a Pending /
Done structure; just append the new row to Pending.

### Step 3 — Commit + push

```bash
git add plan/CRITIQUE.md
git commit -m "jot: <one-line observation summary, ≤ 70 chars>"
git push origin main
```

Commit body: leave empty. The CRITIQUE.md row carries the
detail. The commit message just lands the note.

No `Co-Authored-By:`. No emojis. Lowercase "thock" if the
summary mentions the project name.

### Step 4 — Done

Print one short confirmation line:

```
jot: filed [MED] /article — footer padding too tight (commit a3f1e2c).
     Next /iterate or /march tick will score it against pending work.
```

Exit cleanly.

## 5. How `/jot` flows into thock's loop

```
/jot                      → plan/CRITIQUE.md (Pending, source: user)
                                       │
/iterate (autonomous)     ←────────────┘
  ├─ scores all findings (user-source +0.5 bump)
  ├─ picks top
  ├─ opens GitHub issue (phase 15a — at fix-time, not at jot-time)
  ├─ ships fix (commit body has `Closes #N`)
  ├─ deploy:check → posts close-comment with deploy URL
  └─ moves CRITIQUE.md row Pending → Done (carrying `issue: #N`)
```

**Phase 15a contract — the issue opens at fix-time, not at
jot-time.** A `/jot` does not open a GitHub issue immediately;
that would dilute the issues tab into a noise feed of every
spotted thing. The issue opens when `/iterate` (or `/march`) picks
the jot to ship, and auto-closes via the fix commit's `Closes #N`
trailer. To watch a jot land in real time on the issues tab:
`/jot ...`, then `/iterate`, then watch
https://github.com/daretodave/thock/issues — the issue appears as
the fix begins and disappears (closed) as the fix lands.

**No `/oversight` needed.** thock's address loop already
drains `plan/CRITIQUE.md` autonomously — the user-source +0.5
bump means your jot typically beats auto-detected findings at
the same severity, so it gets picked next time `/iterate`
runs.

**Caveat: `/march` ships pending phases first.** When thock
has queued phases (currently it does — phase 7 is the news
pillar from critique pass 1), `/iterate` doesn't fire by
default. Two escapes:

1. `/jot --severity high <text>` — high-severity findings
   have impact 8–10, dominating the rubric. Still doesn't
   interrupt phase work but jumps the iterate queue when it
   fires.
2. `/jot <text>` then immediately `/iterate` — runs iterate
   once directly, drains the highest-scoring finding (almost
   certainly your fresh jot), exits.

## 6. Hard rules

1. **Never ask questions.** Decide-and-ship.
2. **Never modify code, only `plan/CRITIQUE.md`.**
3. **Atomic commit, immediate push.**
4. **No verify gate, no deploy gate.** Nothing to verify or
   deploy.
5. **No emojis. No `Co-Authored-By:`.**
6. **Lowercase commit subject prefix `jot:`.**
7. **Source field is always `user`.** Never spoof it for
   automated entries — that's what `reader` is for.
8. **Lowercase "thock"** in any text you write.

## 7. Failure modes

- **`plan/CRITIQUE.md` write fails** (permissions, disk full).
  Print error, exit 1. The note is lost; user re-jots.
- **`git push` rejected** (divergent remote — likely the
  cloud tick committed something between your pull and push).
  Pull again, re-append, push. Up to 3 retries.
- **Empty argument** (`/jot` with no text). Print one-line
  usage hint, exit 0. Do not commit.
- **Argument parses to flags only** (`/jot --url /foo`). Same
  as empty — need observation text.

## 8. What `/jot` is NOT

- **Not `/oversight`.** Doesn't audit, doesn't brief, doesn't
  ask questions, doesn't adjust the plan.
- **Not `/critique`.** Doesn't visit the live site, doesn't
  delegate to `reader`, doesn't run a structured pass.
- **Not `/triage`.** Doesn't open or label GitHub issues. (If
  the spotted issue genuinely warrants a public issue, file
  one separately on the daretodave/thock repo — `/jot` is
  for the private working notes.)
- **Not a fix.** Doesn't ship code. The fix happens in
  `/iterate`'s next tick.
- **Not blocking.** Returns in seconds. The cloud loop never
  pauses for user input.

## 9. Quick reference

```bash
# What it touches
plan/CRITIQUE.md              # appends one row to Pending

# What it runs
git pull --ff-only
git add plan/CRITIQUE.md
git commit -m "jot: ..."
git push origin main

# What it does NOT run
pnpm verify                   # no code change
pnpm deploy:check             # no deploy
AskUserQuestion               # no questions back
```
