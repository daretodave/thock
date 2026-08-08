Font binaries in this directory are static instances of Google Fonts,
licensed under the SIL Open Font License 1.1 (https://openfontlicense.org).

- `newsreader-*.woff` — Newsreader (https://fonts.google.com/specimen/Newsreader)
- `jetbrains-mono-400-normal.woff` — JetBrains Mono (https://fonts.google.com/specimen/JetBrains+Mono)

Fetched from `fonts.googleapis.com`/`fonts.gstatic.com` and vendored here
because `next/font/google` doesn't expose raw font buffers, and the edge
`ImageResponse` (Satori) renderer used by `apps/web/src/app/**/opengraph-image.tsx`
needs real `ArrayBuffer` data passed via its `fonts` option — see `../fonts.ts`.
