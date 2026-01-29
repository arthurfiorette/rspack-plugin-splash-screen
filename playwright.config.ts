import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for testing the splash screen plugin
 */
export default defineConfig({
  testDir: './tests',
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use
  reporter: 'html',

  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:4000',
    // Collect trace when retrying the failed test
    trace: 'on-first-retry'
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  // Run the dev server before starting the tests
  webServer: {
    command: 'cd example && pnpm run preview',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
});
