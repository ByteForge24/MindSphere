import { test, expect } from '@playwright/test';
import { assertNoErrorToast } from './helpers';

const ROLES = ['student', 'professional', 'other'] as const;

test.describe('Signup — Role Selection UI Feedback', () => {
  for (const role of ROLES) {
    test(`clicking "${role}" role shows visible highlight`, async ({ page }) => {
      console.log(`[signup-role] Testing role: ${role}`);
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/create your account/i)).toBeVisible();

      // Verify all three role options exist via data-testid
      for (const r of ROLES) {
        await expect(page.locator(`[data-testid="role-${r}"]`)).toBeVisible();
        console.log(`[signup-role]   ✓ Role option "${r}" exists`);
      }

      // Click the role card using data-testid
      const card = page.locator(`[data-testid="role-${role}"]`);
      await card.click();
      await page.waitForTimeout(300);

      // Verify the card has the 'selected' class
      await expect(card).toHaveClass(/selected/);
      console.log(`[signup-role]   ✓ Role "${role}" has 'selected' class`);

      // Verify a CheckCircle icon appears (rendered as an svg inside the selected card)
      await expect(card.locator('svg').first()).toBeVisible();

      // Verify unselected roles do NOT have the 'selected' class
      for (const other of ROLES) {
        if (other === role) continue;
        const otherCard = page.locator(`[data-testid="role-${other}"]`);
        await expect(otherCard).not.toHaveClass(/selected/);
        console.log(`[signup-role]   ✓ Role "${other}" is NOT selected`);
      }

      console.log(`[signup-role] ✅ Role "${role}" highlight verified`);
    });
  }
});

test.describe('Signup — Full Flow Per Role', () => {
  for (const role of ROLES) {
    test(`registers new user with "${role}" role`, async ({ page }) => {
      const email = `test${Date.now()}@mail.com`;
      console.log(`[signup-flow] Role: ${role}, Email: ${email}`);

      await page.goto('/register');
      await page.waitForLoadState('networkidle');

      // Fill form
      console.log('[signup-flow] Filling form fields');
      await page.getByLabel(/full name/i).fill(`E2E ${role} User`);
      await page.getByLabel(/email/i).fill(email);
      await page.locator('#password').fill('TestPass123!');
      await page.locator('#confirmPassword').fill('TestPass123!');

      // Select role via data-testid
      console.log(`[signup-flow] Selecting role: ${role}`);
      await page.locator(`[data-testid="role-${role}"]`).click();
      await expect(page.locator(`[data-testid="role-${role}"]`)).toHaveClass(/selected/);

      // Submit
      console.log('[signup-flow] Clicking Create My Account');
      await page.getByRole('button', { name: /create my account/i }).click();

      // Wait for navigation away from /register
      console.log('[signup-flow] Waiting for redirect');
      await page.waitForURL(url => !url.toString().includes('/register'), {
        timeout: 20_000,
      });
      console.log(`[signup-flow] Redirected to: ${page.url()}`);

      // Verify no error toast
      await assertNoErrorToast(page);

      // Accept /, /dashboard, or /login as success
      expect(page.url()).toMatch(/\/(dashboard|login)?$/);
      console.log(`[signup-flow] ✅ Signup with role "${role}" succeeded`);
    });
  }
});
