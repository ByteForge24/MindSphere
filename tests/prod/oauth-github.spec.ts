import { test, expect } from '@playwright/test';

const BACKEND_URL = 'https://mindsphere-backend-9c0u.onrender.com';

test.describe('GitHub OAuth Redirect', () => {
  test.describe.configure({ retries: 2 });

  test.beforeAll(async ({ request }) => {
    // Warm up the backend to prevent Render cold-start timeouts
    console.log('[oauth-github] Warming up backend...');
    try {
      const res = await request.get(`${BACKEND_URL}/health`);
      console.log(`[oauth-github] Warmup status: ${res.status()}`);
    } catch (e) {
      console.log('[oauth-github] Warmup ping failed (will retry in test)');
    }
  });

  test('clicking GitHub button redirects to github.com/login/oauth', async ({ page }) => {
    console.log('[oauth-github] Step 1: Opening /login');
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Find the GitHub OAuth link
    const githubLink = page.getByRole('link', { name: /github/i });
    await expect(githubLink).toBeVisible();

    console.log('[oauth-github] Step 2: Clicking GitHub OAuth link');
    const href = await githubLink.getAttribute('href');
    console.log(`[oauth-github] GitHub link href: ${href}`);
    expect(href).toContain('/api/auth/github');

    // Click and follow the redirect chain
    await githubLink.click();

    // Wait for navigation to GitHub's OAuth page
    console.log('[oauth-github] Step 3: Waiting for redirect to github.com');
    await expect(page).toHaveURL(/github\.com/, { timeout: 45_000 });

    console.log(`[oauth-github] Redirected to: ${page.url()}`);
    console.log('[oauth-github] ✅ GitHub OAuth flow initiated successfully');
  });
});
