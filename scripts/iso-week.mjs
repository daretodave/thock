#!/usr/bin/env node
// Prints the ISO 8601 week for the current date, e.g. "2026-W21".
// Used by skills/march.md Step 0.5 (weekly snapshot gate) to determine
// whether a trends snapshot exists for the current week.

const now = new Date()
const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay() // 1=Mon … 7=Sun

// The ISO week year is defined by the Thursday of the week.
const thursday = new Date(now)
thursday.setDate(now.getDate() + (4 - dayOfWeek))
const year = thursday.getFullYear()

// Week 1 contains Jan 4. Walk back to Monday of that week.
const jan4 = new Date(year, 0, 4)
const jan4Day = jan4.getDay() === 0 ? 7 : jan4.getDay()
const weekOneMonday = new Date(jan4)
weekOneMonday.setDate(jan4.getDate() - (jan4Day - 1))

const week =
  Math.floor((thursday.getTime() - weekOneMonday.getTime()) / (7 * 864e5)) + 1

console.log(`${year}-W${String(week).padStart(2, '0')}`)
