'use client'

import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import type { ReactElement } from 'react'
import { PILLARS } from '@thock/seo'

/**
 * Mobile primary-nav toggle. Renders a hamburger button at `<md`
 * widths and a slide-down drawer holding the 5 pillar links.
 *
 * Phase 7's critique flagged the nav as unreachable on 375px —
 * the desktop nav is `hidden md:flex`, so the only way to surface
 * those links on mobile is a dedicated toggle. The drawer closes
 * on link click, on Escape, and when the viewport widens past
 * `md` (so the drawer never lingers after a rotation).
 */
export function MobileNav(): ReactElement {
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    function onResize() {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close primary navigation' : 'Open primary navigation'}
        aria-expanded={open}
        aria-controls={menuId}
        data-testid="mobile-nav-toggle"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center border border-border text-text-2 hover:text-text hover:border-border-hi transition-colors md:hidden"
      >
        {open ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 6 L18 18" />
            <path d="M18 6 L6 18" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M3 12h18" />
            <path d="M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <nav
          id={menuId}
          aria-label="Primary mobile"
          data-testid="mobile-nav-menu"
          className="absolute left-0 right-0 top-full z-40 border-b border-border bg-bg md:hidden"
        >
          <ul className="mx-auto flex w-full max-w-[1280px] flex-col px-6 py-4 sm:px-10">
            {PILLARS.map((pillar) => (
              <li key={pillar.slug} className="border-b border-border last:border-b-0">
                <Link
                  href={pillar.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-serif text-h3 text-text hover:text-accent transition-colors"
                >
                  {pillar.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}
