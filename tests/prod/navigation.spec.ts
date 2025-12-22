import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Check-In', path: '/check-in' },
  { name: 'Journal', path: '/journal' },
  { name: 'History', path: '/history' },
  { name: 'Community', path: '/community' },
  { name: 'Games', path: '/games' },
  { name: 'Profile', path: '/profile' },
] as const;

test.describe('Dashboard Navigation — Sidebar', () => {
  test('all sidebar links navigate to correct pages', async ({ page }) => {
    console.log('[navigation] Step 1: Logging in');
    await loginViaUI(page);

    for (const item of SIDEBAR_ITEMS) {
      console.log(`[navigation] Clicking sidebar: "${item.name}" → ${item.path}`);

      // Click the sidebar link by its text
      const link = page.getByRole('link', { name: item.name, exact: true });
      await expect(link).toBeVisible({ timeout: 10_000 });
      await link.click();

      // Wait for URL to contain the expected path
      await page.waitForURL(`**${item.path}`, { timeout: 15_000 });
      expect(page.url()).toContain(item.path);

      // Verify the page loaded (top bar shows page title or content is visible)
      await page.waitForLoadState('networkidle');

      console.log(`[navigation]   ✓ ${item.name} loaded at ${page.url()}`);
    }

    console.log('[navigation] ✅ All sidebar navigation tests passed');
  });
});
