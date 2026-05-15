import type { ReactElement, ReactNode } from 'react'

export type CalloutProps = {
  children: ReactNode
  type?: 'note' | 'warn' | 'info'
  title?: string
}

const TONE: Record<NonNullable<CalloutProps['type']>, string> = {
  note: 'border-border-hi',
  info: 'border-accent-mu',
  warn: 'border-down',
}

export function Callout({
  children,
  type = 'note',
  title,
}: CalloutProps): ReactElement {
  return (
    <aside
      // mt-8 (32px) above, mb-12 (48px) below. Asymmetric on purpose:
      // when the next sibling is a SerifH2 (mt-20 = 80px), margin-collapse
      // wins on the H2 side regardless. When the next sibling is a `<p>`
      // (thock-prose strips top margin), the aside's bottom margin is the
      // ONLY gap — the prior `my-8` left a 32px slot, only ~1.05× the
      // 1.7-leading body, which reads as headbutting. mb-12 makes the
      // visible gap ≈ 1.57× line-height, an obvious blank line.
      // History: my-6 → my-8 (user-jot 11d932d); my-8 → mt-8 mb-12 (user
      // feedback 2026-05-14 "aside semantic elements need a margin bottom
      // they headbutt the h2's or anything under them").
      className={`mt-8 mb-12 border ${TONE[type]} bg-surface px-5 py-4 text-text-2`}
      role="note"
    >
      {title && (
        <h2 className="mb-2 font-mono text-micro uppercase tracking-[0.08em] text-text-2" data-testid="callout-title">
          {title}
        </h2>
      )}
      <div className="text-body">{children}</div>
    </aside>
  )
}
