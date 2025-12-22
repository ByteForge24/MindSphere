import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers';

test.describe('History Page', () => {
  test('displays mood analytics section', async ({ page }) => {
    console.log('[history] Step 1: Logging in');
    await loginViaUI(page);

    console.log('[history] Step 2: Navigating to /history');
    await page.goto('/history');
    await page.waitForLoadState('networkidle');

    // Verify page heading
    console.log('[history] Step 3: Verifying page content');
    await expect(page.getByText(/your wellness journey/i).first()).toBeVisible();
    console.log('[history]   ✓ Page heading visible');

    // Verify mood history analytics card
    await expect(page.getByText(/mood history analytics/i).first()).toBeVisible();
    console.log('[history]   ✓ Mood History Analytics section present');

    // Verify chart or content renders (the chart is always rendered based on our research)
    const chartOrEmptyState = page.locator('.recharts-responsive-container, [class*="recharts"]').first();
    const hasChart = await chartOrEmptyState.count() > 0;
    if (hasChart) {
      console.log('[history]   ✓ Chart rendered');
    } else {
      // Even without the chart, page should at least have the analytics heading
      console.log('[history]   ℹ No chart element found — checking for analytics content');
      await expect(page.getByText(/mood & energy tracking/i).first()).toBeVisible();
    }

    // Verify stat cards
    await expect(page.getByText(/key metrics/i).first()).toBeVisible();
    console.log('[history]   ✓ Key Metrics section present');

    console.log('[history] ✅ History page test passed');
  });
});
