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
      // my-8 (32px each side) — paired with SerifH2's mt-16 so a
      // Callout block followed by an H2 has visible breathing room
      // even after CSS margin-collapse picks the larger of the two.
      // Was my-6; bumped per user-jot 11d932d.
      className={`my-8 border ${TONE[type]} bg-surface px-5 py-4 text-text-2`}
      role="note"
    >
      {title && (
        <div className="mb-2 font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          {title}
        </div>
      )}
      <div className="text-body">{children}</div>
    </aside>
  )
}
