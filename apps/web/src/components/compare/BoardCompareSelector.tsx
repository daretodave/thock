'use client'

import { useEffect, useState, type ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import type { Board } from '@thock/data'

export type BoardCompareSelectorProps = {
  boards: Board[]
  initialA: string
  initialB: string
}

export function BoardCompareSelector({
  boards,
  initialA,
  initialB,
}: BoardCompareSelectorProps): ReactElement {
  const router = useRouter()
  const [a, setA] = useState(initialA)
  const [b, setB] = useState(initialB)

  useEffect(() => setA(initialA), [initialA])
  useEffect(() => setB(initialB), [initialB])

  const canCompare = a !== '' && b !== '' && a !== b

  function handleCompare() {
    if (canCompare) {
      router.push(`/compare/board?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`)
    }
  }

  const selectClass =
    'bg-surface border border-border rounded px-3 py-2 text-body text-text font-mono ' +
    'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg ' +
    'min-w-0 flex-1'

  return (
    <div
      data-testid="compare-selector"
      className="flex flex-col sm:flex-row gap-3 pb-8 items-end"
    >
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <label
          htmlFor="compare-board-select-a"
          className="font-mono text-micro uppercase tracking-[0.08em] text-text-2"
        >
          Board A
        </label>
        <select
          id="compare-board-select-a"
          data-testid="compare-select-a"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className={selectClass}
          aria-label="First board"
        >
          <option value="">Select a board…</option>
          {boards.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <label
          htmlFor="compare-board-select-b"
          className="font-mono text-micro uppercase tracking-[0.08em] text-text-2"
        >
          Board B
        </label>
        <select
          id="compare-board-select-b"
          data-testid="compare-select-b"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className={selectClass}
          aria-label="Second board"
        >
          <option value="">Select a board…</option>
          {boards.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <button
        data-testid="compare-button"
        type="button"
        onClick={handleCompare}
        disabled={!canCompare}
        className={
          'px-5 py-2 rounded font-mono text-small uppercase tracking-[0.08em] transition-colors ' +
          (canCompare
            ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer'
            : 'bg-surface text-text-3 cursor-not-allowed')
        }
      >
        Compare
      </button>
    </div>
  )
}
