import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

/**
 * E2E runs against the production build on its own port (E2E_PORT, default 3100);
 * a running server there is reused locally.
 * Setup: `npx playwright install chromium`, or PW_CHANNEL=msedge to use Edge.
 */
export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 4,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    channel: process.env.PW_CHANNEL || undefined,
    // PW_SLOWMO=500 with --headed pauses 500 ms per action.
    launchOptions: { slowMo: Number(process.env.PW_SLOWMO ?? 0) },
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: BASE_URL,
    timeout: 300_000,
    reuseExistingServer: !isCI,
    env: {
      // Canonical, sitemap and OG URLs resolve to the test server.
      NEXT_PUBLIC_SITE_URL: BASE_URL
    }
  }
});
