/**
 * thock design tokens — TypeScript view of `tokens.css`.
 *
 * Each entry is a CSS-variable reference (`var(--thock-*)`) so runtime
 * usage stays consistent with the source CSS and theme switching
 * works automatically. The shape here is the contract the test in
 * `__tests__/index.test.ts` enforces against `tokens.css`.
 */

export const colors = {
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
} as const

export const fonts = {
  serif: 'var(--thock-serif)',
  sans: 'var(--thock-sans)',
  mono: 'var(--thock-mono)',
} as const

export const space = {
  '1': 'var(--thock-1)',
  '2': 'var(--thock-2)',
  '3': 'var(--thock-3)',
  '4': 'var(--thock-4)',
  '5': 'var(--thock-5)',
  '6': 'var(--thock-6)',
  '7': 'var(--thock-7)',
  '8': 'var(--thock-8)',
  '9': 'var(--thock-9)',
} as const

export const radii = {
  '1': 'var(--thock-r-1)',
  '2': 'var(--thock-r-2)',
  '3': 'var(--thock-r-3)',
  pill: 'var(--thock-r-pill)',
} as const

export const fontSizes = {
  display: 'var(--thock-display)',
  h1: 'var(--thock-h1)',
  h2: 'var(--thock-h2)',
  h3: 'var(--thock-h3)',
  body: 'var(--thock-body)',
  small: 'var(--thock-small)',
  micro: 'var(--thock-micro)',
} as const

export const tokens = {
  colors,
  fonts,
  space,
  radii,
  fontSizes,
} as const

export type ThockTokens = typeof tokens
