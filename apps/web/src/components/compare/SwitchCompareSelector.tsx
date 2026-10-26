'use client'

import { useState, type ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import type { Switch } from '@thock/data'

export type SwitchCompareSelectorProps = {
  switches: Switch[]
  initialA: string
  initialB: string
}

export function SwitchCompareSelector({
  switches,
  initialA,
  initialB,
}: SwitchCompareSelectorProps): ReactElement {
  const router = useRouter()
  const validate = (slug: string): string =>
    switches.some((s) => s.slug === slug) ? slug : ''
  const [a, setA] = useState(validate(initialA))
  const [b, setB] = useState(validate(initialB))

  // A new URL pair (or list) re-validates that side: React's "adjust state
  // when a prop changes", set during render rather than in an effect.
  const [syncedA, setSyncedA] = useState({ slug: initialA, switches })
  if (syncedA.slug !== initialA || syncedA.switches !== switches) {
    setSyncedA({ slug: initialA, switches })
    setA(validate(initialA))
  }
  const [syncedB, setSyncedB] = useState({ slug: initialB, switches })
  if (syncedB.slug !== initialB || syncedB.switches !== switches) {
    setSyncedB({ slug: initialB, switches })
    setB(validate(initialB))
  }

  const canCompare = a !== '' && b !== '' && a !== b
  const showSameSelectionHint = a !== '' && b !== '' && a === b

  function handleCompare() {
    if (canCompare) {
      router.push(`/compare/switch?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`)
    }
  }

  const selectClass =
    'bg-surface border border-border rounded-sm px-3 py-2 text-body text-text font-mono ' +
    'focus:outline-hidden focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg ' +
    'min-w-0 flex-1'

  return (
    <div
      data-testid="compare-selector"
      className="flex flex-col sm:flex-row gap-3 pb-8 items-end"
    >
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <label
          htmlFor="compare-select-a"
          className="font-mono text-micro uppercase tracking-[0.08em] text-text-2"
        >
          Switch A
        </label>
        <select
          id="compare-select-a"
          data-testid="compare-select-a"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className={selectClass}
        >
          <option value="">Select a switch…</option>
          {switches.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <label
          htmlFor="compare-select-b"
          className="font-mono text-micro uppercase tracking-[0.08em] text-text-2"
        >
          Switch B
        </label>
        <select
          id="compare-select-b"
          data-testid="compare-select-b"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className={selectClass}
        >
          <option value="">Select a switch…</option>
          {switches.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <button
          data-testid="compare-button"
          type="button"
          onClick={handleCompare}
          disabled={!canCompare}
          aria-describedby={showSameSelectionHint ? 'compare-same-selection-hint' : undefined}
          className={
            'px-5 py-2 rounded-sm font-mono text-small uppercase tracking-[0.08em] transition-colors ' +
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu ' +
            (canCompare
              ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer'
              : 'bg-surface text-text-3 cursor-not-allowed')
          }
        >
          Compare
        </button>
        {showSameSelectionHint && (
          <p
            id="compare-same-selection-hint"
            role="status"
            aria-live="polite"
            className="font-mono text-micro text-text-2"
          >
            Pick two different switches to compare
          </p>
        )}
      </div>
    </div>
  )
}
