'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { PILLARS } from '@thock/seo'

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

// The /tools index links out to /quiz/* and /compare/* pages, which don't
// nest under /tools — so the Tools nav item needs to match those prefixes
// too, unlike pillar items whose sub-routes genuinely nest under their href.
const TOOLS_ACTIVE_PREFIXES = ['/tools', '/quiz', '/compare']

function isToolsActive(pathname: string): boolean {
  return TOOLS_ACTIVE_PREFIXES.some((prefix) => isActive(pathname, prefix))
}

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
  const toggleRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key === 'Tab' && !e.shiftKey) {
        const focusable = [
          toggleRef.current,
          ...Array.from(navRef.current?.querySelectorAll('a') ?? []),
        ].filter((el): el is HTMLButtonElement | HTMLAnchorElement => el !== null)
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
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
        ref={toggleRef}
        type="button"
        aria-label={open ? 'Close primary navigation' : 'Open primary navigation'}
        aria-expanded={open}
        aria-controls={menuId}
        data-testid="mobile-nav-toggle"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center border border-border text-text-2 hover:text-text hover:border-border-hi transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
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
          ref={navRef}
          id={menuId}
          aria-label="Primary mobile"
          data-testid="mobile-nav-menu"
          className="absolute left-0 right-0 top-full z-40 border-b border-border bg-bg md:hidden"
        >
          <ul className="mx-auto flex w-full max-w-[1280px] flex-col px-6 py-4 sm:px-10">
            {PILLARS.map((pillar) => {
              const active = isActive(pathname, pillar.href)
              return (
                <li key={pillar.slug} className="border-b border-border last:border-b-0">
                  <Link
                    href={pillar.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`block py-3 font-serif text-h3 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu ${
                      active ? 'text-accent' : 'text-text hover:text-accent'
                    }`}
                  >
                    {pillar.label}
                  </Link>
                </li>
              )
            })}
            <li className="border-b border-border last:border-b-0">
              <Link
                href="/tools"
                data-testid="mobile-nav-tools-link"
                onClick={() => setOpen(false)}
                aria-current={isToolsActive(pathname) ? 'page' : undefined}
                className={`block py-3 font-serif text-h3 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu ${
                  isToolsActive(pathname) ? 'text-accent' : 'text-text hover:text-accent'
                }`}
              >
                Tools
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  )
}
