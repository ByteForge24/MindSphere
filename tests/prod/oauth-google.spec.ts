import { test, expect } from '@playwright/test';

const BACKEND_URL = 'https://mindsphere-backend-9c0u.onrender.com';

test.describe('Google OAuth Redirect', () => {
  test.describe.configure({ retries: 2 });

  test.beforeAll(async ({ request }) => {
    // Warm up the backend to prevent Render cold-start timeouts
    console.log('[oauth-google] Warming up backend...');
    try {
      const res = await request.get(`${BACKEND_URL}/health`);
      console.log(`[oauth-google] Warmup status: ${res.status()}`);
    } catch (e) {
      console.log('[oauth-google] Warmup ping failed (will retry in test)');
    }
  });

  test('clicking Google button redirects to accounts.google.com', async ({ page }) => {
    console.log('[oauth-google] Step 1: Opening /login');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Find the Google OAuth link
    const googleLink = page.getByRole('link', { name: /google/i });
    await expect(googleLink).toBeVisible();

    console.log('[oauth-google] Step 2: Clicking Google OAuth link');
    const href = await googleLink.getAttribute('href');
    console.log(`[oauth-google] Google link href: ${href}`);
    expect(href).toContain('/api/auth/google');

    // Click and follow the redirect chain
    await googleLink.click();

    // Wait for navigation to Google's domain
    console.log('[oauth-google] Step 3: Waiting for redirect to accounts.google.com');
    await expect(page).toHaveURL(/accounts\.google\.com/, { timeout: 45_000 });

    console.log(`[oauth-google] Redirected to: ${page.url()}`);
    console.log('[oauth-google] ✅ Google OAuth flow initiated successfully');
  });
});
