'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactElement } from 'react'
import { PILLARS } from '@thock/seo'

type NavItem = {
  key: string
  label: string
  href: string
  testId?: string
}

const NAV_ITEMS: NavItem[] = [
  ...PILLARS.map((pillar) => ({ key: pillar.slug, label: pillar.label, href: pillar.href })),
  { key: 'tools', label: 'Tools', href: '/tools', testId: 'header-tools-link' },
]

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
 * Desktop primary-nav links. Split out as a client component (unlike the
 * rest of `Header`) because `aria-current`/active styling needs the live
 * pathname — `usePathname()` only works inside a client boundary.
 */
export function PrimaryNavLinks(): ReactElement {
  const pathname = usePathname()

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const active = item.key === 'tools' ? isToolsActive(pathname) : isActive(pathname, item.href)
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            data-testid={item.testId}
            className={`font-sans text-small transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu ${
              active ? 'text-text' : 'text-text-2 hover:text-text'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </>
  )
}
