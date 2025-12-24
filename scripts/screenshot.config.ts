import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '../scripts',
  testMatch: 'capture-screenshots.ts',
  timeout: 120_000,
  workers: 1,
  use: {
    baseURL: 'https://mindsphere-hub.vercel.app',
    headless: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
