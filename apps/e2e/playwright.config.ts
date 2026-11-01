import { defineConfig, devices } from '@playwright/test'

// E2E_PORT overrides the default so a local run never silently
// reuses another project's server already bound to 4173
// (reuseExistingServer is on outside CI).
const PORT = Number(process.env['E2E_PORT'] ?? 4173)
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI'] ? 'github' : 'list',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /.*\.mobile\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'mobile',
      testMatch: /.*\.mobile\.spec\.ts/,
      use: { ...devices['Pixel 5'], viewport: { width: 375, height: 800 } },
    },
  ],
  webServer: {
    command:
      `pnpm --filter @thock/web build && pnpm --filter @thock/web exec next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      // Suppress telemetry in e2e builds — `<VercelAnalytics>` and
      // `<SpeedInsights>` read this at SSR time and render null when
      // set, so Playwright navigation never pollutes prod datasets.
      DISABLE_ANALYTICS: '1',
    },
  },
})
