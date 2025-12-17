import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:8080';
const isExternalEnvironment = !!process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  workers: 1, // Serial execution to avoid flaky auth/state conflicts
  retries: process.env.CI ? 2 : 1, // Retry flaky tests

  use: {
    baseURL: baseURL,
    headless: true,
  },

  webServer: isExternalEnvironment ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    cwd: '.',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});
