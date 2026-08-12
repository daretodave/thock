Font binaries in this directory are static instances of Google Fonts,
licensed under the SIL Open Font License 1.1 (https://openfontlicense.org).

- `newsreader-variable-*.woff2` — Newsreader (https://fonts.google.com/specimen/Newsreader)
- `ibm-plex-sans-variable.woff2` — IBM Plex Sans (https://fonts.google.com/specimen/IBM+Plex+Sans)
- `jetbrains-mono-variable.woff2` — JetBrains Mono (https://fonts.google.com/specimen/JetBrains+Mono)

Each file is the variable-weight "latin" subset Google now serves for
these families (single physical file covering the whole `wght` axis,
confirmed via each file's `fvar` table). Vendored here and loaded through
`next/font/local` in `../layout.tsx` because `next/font/google` fetches
these same files from `fonts.gstatic.com` at build time with no local
cache — see `plan/AUDIT.md` finding filed 2026-08-12 (`/digest` nightly
breadth pass): a hashed-URL/manifest drift between Next.js's bundled
Google Fonts manifest and Google's live hosting made `pnpm build` fail
outright on a fresh build once, clearing on immediate retry with zero
code changes. Same fix shape already applied to the OG-image renderer —
see `../../components/og/fonts/NOTICE.md`.
