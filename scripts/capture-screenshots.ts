/**
 * Capture latest screenshots of every MindSphere page for the README.
 * Run: npx playwright test scripts/capture-screenshots.ts --config=tests/prod/playwright.config.ts
 */
import { test, expect } from '@playwright/test';
import path from 'path';

const PROD_URL = 'https://mindsphere-hub.vercel.app';
const BACKEND_URL = 'https://mindsphere-backend-9c0u.onrender.com';
const TEST_USER = {
  email: 'prodtest@mindsphere.com',
  password: 'TestPass123!',
};
const OUT = path.resolve(__dirname, '..', 'docs', 'screenshots');

test.describe('Capture README Screenshots', () => {
  test.setTimeout(120_000);

  test('capture all pages', async ({ page }) => {
    // Set a nice viewport for screenshots
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Warm up backend
    console.log('Warming up backend...');
    try {
      const res = await page.request.get(`${BACKEND_URL}/health`);
      console.log(`Backend health: ${res.status()}`);
    } catch { /* ignore */ }
    await page.waitForTimeout(2000);

    // 1. Landing / Index page
    console.log('📸 Landing page');
    await page.goto(PROD_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT}/01-landing.png`, fullPage: false });

    // 2. Login page
    console.log('📸 Login page');
    await page.goto(`${PROD_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/02-login.png`, fullPage: false });

    // 3. Register page
    console.log('📸 Register page');
    await page.goto(`${PROD_URL}/register`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/03-register.png`, fullPage: false });

    // Now log in
    console.log('Logging in...');
    await page.goto(`${PROD_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.locator('#password').fill(TEST_USER.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await page.waitForTimeout(3000); // let dashboard data load

    // 4. Dashboard
    console.log('📸 Dashboard');
    await page.screenshot({ path: `${OUT}/04-dashboard.png`, fullPage: false });

    // 5. Check-In page
    console.log('📸 Check-In');
    await page.goto(`${PROD_URL}/check-in`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT}/05-checkin.png`, fullPage: false });

    // 6. Journal page
    console.log('📸 Journal');
    await page.goto(`${PROD_URL}/journal`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT}/06-journal.png`, fullPage: false });

    // 7. History / Analytics
    console.log('📸 History');
    await page.goto(`${PROD_URL}/history`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT}/07-history.png`, fullPage: false });

    // 8. Community
    console.log('📸 Community');
    await page.goto(`${PROD_URL}/community`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT}/08-community.png`, fullPage: false });

    // 9. Games
    console.log('📸 Games');
    await page.goto(`${PROD_URL}/games`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT}/09-games.png`, fullPage: false });

    // 10. Profile
    console.log('📸 Profile');
    await page.goto(`${PROD_URL}/profile`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT}/10-profile.png`, fullPage: false });

    console.log('✅ All screenshots captured in docs/screenshots/');
  });
});
