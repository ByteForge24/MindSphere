import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {

  test('login page UI snapshot', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('signup page UI snapshot', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveScreenshot('signup-page.png');
  });

  test('dashboard UI snapshot', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard-page.png');
  });

  test('journal page UI snapshot', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('journal-page.png');
  });

});
