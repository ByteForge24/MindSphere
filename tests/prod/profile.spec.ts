import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers';

test.describe('Profile Page', () => {
  test('displays profile form and saves changes', async ({ page }) => {
    console.log('[profile] Step 1: Logging in');
    await loginViaUI(page);

    console.log('[profile] Step 2: Navigating to /profile');
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Verify page heading
    await expect(page.getByText(/profile settings/i).first()).toBeVisible();
    console.log('[profile]   ✓ Profile Settings heading visible');

    // Verify Full Name field
    console.log('[profile] Step 3: Verifying form fields');
    const nameField = page.locator('#name');
    await expect(nameField).toBeVisible();
    console.log('[profile]   ✓ Full Name field present');

    // Verify Role dropdown
    await expect(page.getByText(/^role$/i).first()).toBeVisible();
    console.log('[profile]   ✓ Role dropdown present');

    // Verify Email field is disabled
    const emailField = page.locator('#email');
    await expect(emailField).toBeVisible();
    await expect(emailField).toBeDisabled();
    console.log('[profile]   ✓ Email field present and disabled');

    // Update "About You" section
    console.log('[profile] Step 4: Updating About You');
    const bioField = page.locator('#bio');
    await expect(bioField).toBeVisible();
    const bioText = `E2E prod test bio — updated at ${Date.now()}`;
    await bioField.fill(bioText);

    // Save changes
    console.log('[profile] Step 5: Clicking Save All Changes');
    await page.getByRole('button', { name: /save all changes/i }).click();

    // Verify save succeeded via success toast
    console.log('[profile] Step 6: Verifying save');
    await expect(
      page.getByText(/profile updated/i).first()
    ).toBeVisible({ timeout: 15_000 });

    console.log('[profile] ✅ Profile page test passed');
  });
});
