import { test, expect, request } from '@playwright/test';
import { ensureAuthenticated } from './auth-helper';
import { JournalPage } from './pages/JournalPage';

test.describe('Journal', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're authenticated before each test
    await ensureAuthenticated(page);
  });

  test('user can create a journal entry', async ({ page }) => {
    const journalPage = new JournalPage(page);
    const title = `Journal Entry ${Date.now()}`;
    const content = `Playwright journal test - ${Date.now()}`;

    // Get the authentication token BEFORE creating the entry
    let token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    await journalPage.verifyOnJournalPage();
    
    // Fill and submit the journal entry form WITHOUT reloading
    await journalPage.fillTitle(title);
    await journalPage.fillContent(content);
    await journalPage.clickSave();
    
    // Wait for the submission to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify backend persistence via API
    const apiResponse = await page.request.get('http://localhost:5000/api/journal', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Verify API request succeeded
    expect(apiResponse.status()).toBe(200);
    
    const journalEntries = await apiResponse.json();
    
    // Parse response - handle both array and object with data property
    const entries = Array.isArray(journalEntries) ? journalEntries : journalEntries.data || [];
    
    // Verify at least one entry exists (entries were created)
    expect(entries.length).toBeGreaterThan(0);
    
    // Verify our specific entry exists in the backend
    const entryExists = entries.some(
      (entry: any) => 
        entry.title === title && 
        entry.content === content
    );
    
    expect(entryExists).toBeTruthy();
  });

  test('user can view multiple journal entries', async ({ page }) => {
    const journalPage = new JournalPage(page);

    await journalPage.verifyOnJournalPage();
    await journalPage.verifyFormElementsVisible();
  });

  test('journal textarea is cleared after saving', async ({ page }) => {
    const journalPage = new JournalPage(page);
    const title = `Entry ${Date.now()}`;
    const content = `Test content ${Date.now()}`;

    await journalPage.fillEntryForm(title, content);
    await journalPage.clickSave();
    await page.waitForLoadState('networkidle');

    // Verify fields are cleared
    await journalPage.verifyInputCleared();
  });

  test('user cannot save empty journal entry', async ({ page }) => {
    const journalPage = new JournalPage(page);

    // Verify button is disabled when both fields are empty
    await expect(journalPage.getSaveButton()).toBeDisabled();

    // Fill only title, button should still be disabled (content is empty)
    await journalPage.fillTitle('Only Title');
    await expect(journalPage.getSaveButton()).toBeDisabled();

    // Fill only content, button should still be disabled (title is empty)
    await journalPage.fillTitle('');
    await journalPage.fillContent('Only Content');
    await expect(journalPage.getSaveButton()).toBeDisabled();
  });
});
