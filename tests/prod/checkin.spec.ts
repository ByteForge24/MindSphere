import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers';

test.describe('Check-In Page', () => {
  test('submits a mood check-in with text, mood slider, and energy slider', async ({ page }) => {
    console.log('[checkin] Step 1: Logging in');
    await loginViaUI(page);

    console.log('[checkin] Step 2: Navigating to /check-in');
    await page.goto('/check-in');
    await page.waitForLoadState('networkidle');

    // Verify page heading
    await expect(page.getByText(/how are you feeling/i).first()).toBeVisible();
    console.log('[checkin]   ✓ Page heading visible');

    // Verify mood slider present
    const moodLabel = page.getByText(/mood level/i).first();
    await expect(moodLabel).toBeVisible();
    console.log('[checkin]   ✓ Mood Level slider present');

    // Verify energy slider present
    const energyLabel = page.getByText(/energy level/i).first();
    await expect(energyLabel).toBeVisible();
    console.log('[checkin]   ✓ Energy Level slider present');

    // Verify text input present
    const textInput = page.getByPlaceholder(/today i feel/i);
    await expect(textInput).toBeVisible();
    console.log('[checkin]   ✓ Text input present');

    // Fill the text
    console.log('[checkin] Step 3: Filling mood text');
    await textInput.fill('E2E prod test — feeling focused and productive today!');

    // Submit check-in
    console.log('[checkin] Step 4: Clicking Submit Check-in');
    await page.getByRole('button', { name: /submit check-in/i }).click();

    // Verify success toast
    console.log('[checkin] Step 5: Waiting for success confirmation');
    await expect(
      page.getByText(/check-in recorded/i).first()
    ).toBeVisible({ timeout: 20_000 });

    console.log('[checkin] ✅ Check-in test passed');
  });
});
