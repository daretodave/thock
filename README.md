# thock

> *thock* /θɒk/ — *n.* the deep, satisfying sound of a well-tuned mechanical keyboard switch bottoming out.

[![march](https://github.com/daretodave/thock/actions/workflows/march.yml/badge.svg?branch=main)](https://github.com/daretodave/thock/actions/workflows/march.yml)
[![site](https://img.shields.io/website?url=https%3A%2F%2Fthock.netlify.app&label=thock.netlify.app&up_message=live)](https://thock.netlify.app)
[![built with](https://img.shields.io/badge/built%20with-claude%20code-d97757)](https://claude.com/claude-code)
[![methodology: nexus](https://img.shields.io/badge/methodology-nexus-lightgrey)](https://github.com/daretodave/nexus)

An editorial content hub for mechanical keyboard enthusiasts. Lives at [thock.netlify.app](https://thock.netlify.app).

**This site is always being worked on.** An autonomous loop ships improvements 24/7 through a small set of slash commands — new content, broken-link fixes, schema updates, SEO catches, design landings. The cloud half ticks every 2h via [GitHub Actions](https://github.com/daretodave/thock/actions/workflows/march.yml); the local half runs on my laptop. No human in the per-commit loop, but every commit is gated by a hermetic verify (`typecheck → test → build → e2e`) and a post-push deploy gate.

The methodology powering this is [**nexus**](https://github.com/daretodave/nexus) — a portable kit that turns any repo into an autonomous-loop project. If you want to do the same to your own repo, start there.

The product spec is in [`spec.md`](./spec.md). The autonomous build loop is documented below.

---

## Skills

This project is shipped by a small set of autonomous skills, each invoked as a Claude Code slash command. Skills are **source-of-truth** files (under `skills/`) — the slash commands are thin pointers. Other AI clients can follow the skill files directly.

### `/ship-a-phase`

Ship the next pending phase of the [build plan](./plan/steps/01_build_plan.md) end-to-end: code, unit tests, e2e tests, commit, push. The Netlify deploy follows automatically.

```
/ship-a-phase                       # next [ ] phase
/ship-a-phase phase 8               # specific phase by number
/ship-a-phase phase 8 dry-run       # plan + emit brief, no code commit
/loop 30m /ship-a-phase             # autonomous, every 30 min
```

Source: [`skills/ship-a-phase.md`](./skills/ship-a-phase.md)

### `/ship-data`

Ship one self-contained update to the GitHub-as-DB under `/data` — add a record, repair a cross-reference, archive an expired entry, validate against schema, push.

```
/ship-data                          # next data backlog row, or audit→fix
/ship-data add switch gateron-oil-king
/ship-data audit                    # audit-only; emit data/AUDIT.md
/ship-data normalize                # slug + cross-ref repair pass
```

Source: [`skills/ship-data.md`](./skills/ship-data.md)

### `/plan-a-phase`

A thinking pass — refines the next phase brief without shipping code. Useful before a long autonomous run so `/ship-a-phase` has zero ambiguity.

```
/plan-a-phase                       # refine next pending phase
/plan-a-phase phase 8               # refine a specific phase
```

Source: [`skills/plan-a-phase.md`](./skills/plan-a-phase.md)

### `/iterate`

The post-build loop. Audit the site for the highest-impact weakness (content gap, broken link, missing OG, stale data, a11y issue, etc.) and ship one improvement. Designed to run forever once the planned phases are done.

```
/iterate                            # audit + ship the top finding
/iterate audit                      # audit-only; no fix shipped
/iterate content-gaps               # bias toward content
/iterate seo                        # bias toward SEO
/loop 1h /iterate                   # autonomous improvement loop
```

Source: [`skills/iterate.md`](./skills/iterate.md)

### `/critique`

The **external-observer** pass. Spawns the `reader` sub-agent to visit https://thock.netlify.app as a first-time reader would, take notes (visual, voice fidelity, mobile reflow, comprehension, navigation honesty), self-assess what was returned, and append the surviving findings to [`plan/CRITIQUE.md`](./plan/CRITIQUE.md). `/iterate` reads CRITIQUE.md as one of its audit sources — that's the **feedback address loop**.

Rate-limited: only fires when there's a green deploy + ≥12 commits or ≥24h since the last pass. Caps at 6 filed findings per pass.

```
/critique                           # full pass — visits ~6 representative URLs
/critique <url>                     # focused pass on one URL
/critique mobile                    # 375x800 only
```

Source: [`skills/critique.md`](./skills/critique.md)

### `/triage`

The **issue review** loop. Reads open unlabeled issues at github.com/daretodave/thock, classifies each (bug, feature, content, data, docs, etc.), applies a `triage:*` label, posts a short comment, and routes actionable issues into the right backlog (`plan/AUDIT.md`, `data/BACKLOG.md`, or build plan). When there are zero unlabeled issues, exits in <1s — the loop hums on.

`/iterate` and `/ship-data` close issues automatically when their addressing commits ship.

```
/triage                             # all unlabeled open issues
/triage <issue-number>              # focused pass
/triage all                         # re-evaluate every open issue
/triage dry-run                     # classify + report, no labels/comments
```

Source: [`skills/triage.md`](./skills/triage.md)

### `/expand`

The **plan-expansion** pass. Reads accumulated signals (audit findings, critique findings, GH issues, spec drift, design landings, data growth) and proposes new phase candidates to [`plan/PHASE_CANDIDATES.md`](./plan/PHASE_CANDIDATES.md). `/oversight` reviews and promotes — the build plan grows when reality demands it, but never without a human gate.

Posture is set to **bold** in `bearings.md`. Rate-limited (≥20 commits or ≥48h between passes). Caps at 3 candidates per pass — boldness is not flooding.

```
/expand                             # full pass — read signals, file candidates
/expand audit | spec | design       # bias toward one signal source
/expand dry-run                     # report candidates; do not commit
```

Source: [`skills/expand.md`](./skills/expand.md)

### `/march`

The outer dispatcher. Picks the right thing to do automatically:

- unlabeled issues exist → behaves as `/triage`
- critique due (rate-limited) → behaves as `/critique`
- pending phase → behaves as `/ship-a-phase`
- pending data → behaves as `/ship-data`
- expand due + bold posture → behaves as `/expand`
- else → behaves as `/iterate`

Use this with `/loop` for the autonomous-beast endgame.

```
/march                              # one tick: dispatch + execute
/loop /march                        # self-paced autonomous loop
/loop 30m /march                    # autonomous, every 30 min
```

Source: [`skills/march.md`](./skills/march.md)

### `/oversight`

The **user-in-the-loop** command. Pause autonomy, get a tight briefing on current state (shipping velocity, pending phases, open audits, deploy state, working-tree state), answer a targeted questionnaire generated from what was found, and the skill applies your answers as plan adjustments — drop a stuck phase, bias the iterate loop, refresh a brief in light of new design, prune findings.

The only skill that asks you anything. Everything else decides and ships.

```
/oversight                          # full audit + general questionnaire
/oversight phase                    # bias toward phase progress
/oversight content                  # bias toward /iterate findings
/oversight deploy                   # bias toward Netlify / CI/CD
/oversight reset                    # bias toward scope reduction
```

Source: [`skills/oversight.md`](./skills/oversight.md)

---

## Sub-agents

Each skill delegates aggressively to specialist sub-agents (definitions in [`.claude/agents/`](./.claude/agents/)):

| Agent | When invoked |
|---|---|
| `scout` | Open-web research — switch specs, vendor URLs, group-buy dates, trend signals. |
| `content-curator` | Drafting MDX articles in thock's editorial voice. |
| `data-steward` | Schema-heavy data work — new entity types, mass cross-ref repair, normalize passes. |
| `reader` | Fresh-eyes external observer of the live site (used by `/critique`). |

---

## Repo orientation

For any agent landing cold: read [`agents.md`](./agents.md) first. It points you to everything else in the right order.
