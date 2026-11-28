# Footguns

One line per trap, each under its status's section:
`- **slug** · trap → rule · seen N× · last YYYY-MM-DD · open | watch | guarded by <the test, hook or lint>`

`## Open` is read before building. `## Watch` (settle creates it on
first use) holds single sightings, searched before a new line is
added. `## Guarded` holds the ones a test, hook or lint now catches.

## Open

- **alt-not-visible-text** · an `<img alt>` prop reads like a visible-text candidate by name → it's screen-reader-only fallback, never rendered to sighted readers; don't allowlist it as an attribute channel for readTime coverage · seen 1× · last 2026-11-28 · open
## Guarded
