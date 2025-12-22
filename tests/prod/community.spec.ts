import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers';

test.describe('Community Page', () => {
  test('loads community support section and New Group button', async ({ page }) => {
    console.log('[community] Step 1: Logging in');
    await loginViaUI(page);

    console.log('[community] Step 2: Navigating to /community');
    await page.goto('/community');
    await page.waitForLoadState('networkidle');

    // Verify page heading — the h1 contains "Support" and "Community" in separate spans
    console.log('[community] Step 3: Verifying page content');
    await expect(page.getByText(/wellness community/i).first()).toBeVisible({ timeout: 15_000 });
    console.log('[community]   ✓ Wellness Community badge visible');

    // Verify community chat section
    await expect(page.getByText(/community chat/i).first()).toBeVisible();
    console.log('[community]   ✓ Community Chat section present');

    // Verify New Group button exists
    const newGroupBtn = page.getByRole('button', { name: /new group/i });
    await expect(newGroupBtn).toBeVisible();
    console.log('[community]   ✓ New Group button present');

    // Verify no error toasts
    const errorToast = page.locator('.destructive');
    expect(await errorToast.count()).toBe(0);
    console.log('[community]   ✓ No errors on page load');

    console.log('[community] ✅ Community page test passed');
  });
});
