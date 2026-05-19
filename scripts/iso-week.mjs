#!/usr/bin/env node
// Prints the ISO 8601 week for the current date, e.g. "2026-W21".
// Used by skills/march.md Step 0.5 (weekly snapshot gate) to determine
// whether a trends snapshot exists for the current week.

/**
 * Pure ISO 8601 week string for any Date. Exported via __test for unit tests.
 * The ISO week year is defined by the Thursday of the week; this means
 * Dec 29–31 can belong to week 1 of the following year.
 *
 * @param {Date} date
 * @returns {string} e.g. "2026-W21"
 */
export function isoWeekString(date = new Date()) {
  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay() // 1=Mon … 7=Sun

  const thursday = new Date(date)
  thursday.setDate(date.getDate() + (4 - dayOfWeek))
  const year = thursday.getFullYear()

  // Week 1 contains Jan 4. Walk back to Monday of that week.
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() === 0 ? 7 : jan4.getDay()
  const weekOneMonday = new Date(jan4)
  weekOneMonday.setDate(jan4.getDate() - (jan4Day - 1))

  const week =
    Math.floor((thursday.getTime() - weekOneMonday.getTime()) / (7 * 864e5)) + 1

  return `${year}-W${String(week).padStart(2, '0')}`
}

// Exported for unit tests — mirrors the pattern in content-gap-survey.mjs.
export const __test = { isoWeekString }

// CLI entry point: print the current ISO week.
console.log(isoWeekString())
