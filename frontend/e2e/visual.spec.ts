import { test, expect, devices } from '@playwright/test';

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

// Mobile viewport tests using iPhone 13 device configuration
test.use({
  ...devices['iPhone 13']
});

test.describe('Mobile Visual Regression', () => {

  test('mobile login page snapshot', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveScreenshot('mobile-login-page.png');
  });

  test('mobile dashboard snapshot', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-dashboard-page.png');
  });

  test('mobile journal snapshot', async ({ page }) => {
    await page.goto('/journal');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-journal-page.png');
  });

});
