# thock

> *thock* /θɒk/ — *n.* the deep, satisfying sound of a well-tuned mechanical keyboard switch bottoming out.

An editorial content hub for mechanical keyboard enthusiasts. Lives at https://thock.netlify.app.

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

### `/march`

The outer dispatcher. Picks the right thing to do automatically:

- pending phase → behaves as `/ship-a-phase`
- pending data → behaves as `/ship-data`
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

---

## Repo orientation

For any agent landing cold: read [`agents.md`](./agents.md) first. It points you to everything else in the right order.
