import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers';

test.describe('Games Page', () => {
  test('breathing exercise loads with progress bar and cycle counter', async ({ page }) => {
    console.log('[games] Step 1: Logging in');
    await loginViaUI(page);

    console.log('[games] Step 2: Navigating to /games');
    await page.goto('/games');
    await page.waitForLoadState('networkidle');

    // Verify page heading
    console.log('[games] Step 3: Verifying page content');
    await expect(page.getByText(/stress relief/i).first()).toBeVisible();
    console.log('[games]   ✓ Games page heading visible');

    // Verify breathing exercise section
    await expect(page.getByText(/breathing exercise/i).first()).toBeVisible();
    console.log('[games]   ✓ Breathing Exercise section present');

    // Verify progress bar exists (the Progress component renders a div with role="progressbar")
    const progressBars = page.getByRole('progressbar');
    const progressCount = await progressBars.count();
    expect(progressCount).toBeGreaterThanOrEqual(1);
    console.log(`[games]   ✓ Progress bar(s) present (${progressCount} found)`);

    // Verify cycle counter text
    await expect(page.getByText(/cycles/i).first()).toBeVisible();
    console.log('[games]   ✓ Cycle counter present');

    // Verify Start button exists
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible();
    console.log('[games]   ✓ Start button present');

    console.log('[games] ✅ Games page test passed');
  });
});
