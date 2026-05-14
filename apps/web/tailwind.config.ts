import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    // MDX components live in @thock/content. Without this entry,
    // every Tailwind utility used inside Callout, SerifH2, SerifH3,
    // KeyboardImage, PullQuote, Source, InlineViz, etc. is silently
    // purged at build time — the classes appear on rendered DOM but
    // the CSS rules don't exist. Root cause of an aside-headbutting-
    // h2 bug that survived two prior "fixes" because neither could
    // ever land in the compiled stylesheet. 2026-05-14.
    '../../packages/content/src/**/*.{ts,tsx}',
  ],
  darkMode: ['class', '.thock-light'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--thock-bg)',
        'bg-2': 'var(--thock-bg-2)',
        surface: 'var(--thock-surface)',
        'surface-hi': 'var(--thock-surface-hi)',
        border: 'var(--thock-border)',
        'border-hi': 'var(--thock-border-hi)',
        text: 'var(--thock-text)',
        'text-2': 'var(--thock-text-2)',
        'text-3': 'var(--thock-text-3)',
        'text-4': 'var(--thock-text-4)',
        accent: 'var(--thock-accent)',
        'accent-hi': 'var(--thock-accent-hi)',
        'accent-mu': 'var(--thock-accent-mu)',
        up: 'var(--thock-up)',
        down: 'var(--thock-down)',
        flat: 'var(--thock-flat)',
        'tag-switch': 'var(--thock-tag-switch)',
        'tag-layout': 'var(--thock-tag-layout)',
        'tag-brand': 'var(--thock-tag-brand)',
        'tag-material': 'var(--thock-tag-material)',
        'tag-profile': 'var(--thock-tag-profile)',
      },
      fontFamily: {
        serif: ['var(--thock-serif)', 'Newsreader', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['var(--thock-sans)', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--thock-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        micro: ['var(--thock-micro)', { lineHeight: '1.4' }],
        small: ['var(--thock-small)', { lineHeight: '1.45' }],
        body: ['var(--thock-body)', { lineHeight: '1.55' }],
        h3: ['var(--thock-h3)', { lineHeight: '1.3' }],
        h2: ['var(--thock-h2)', { lineHeight: '1.2' }],
        h1: ['var(--thock-h1)', { lineHeight: '1.1' }],
        display: ['var(--thock-display)', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
      },
    },
  },
  plugins: [],
}

export default config
