import { test, expect } from '@playwright/test';

test.describe('Simple Page Load Test', () => {
  test('should load the page and capture errors', async ({ page }) => {
    // Listen for console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
      console.log(`[Browser ${msg.type()}]: ${msg.text()}`);
    });

    // Listen for page errors
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log(`[Page Error]: ${error.message}`);
    });

    try {
      // Navigate to the application
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });

      // Take a screenshot
      await page.screenshot({ path: '__tests__/e2e/screenshots/page-load.png', fullPage: true });

      console.log('Page loaded successfully');
      console.log('Console messages:', consoleMessages);
      console.log('Page errors:', pageErrors);

      // Check if the page has the expected title
      const title = await page.title();
      console.log('Page title:', title);

    } catch (error) {
      console.error('Failed to load page:', error.message);
      await page.screenshot({ path: '__tests__/e2e/screenshots/error-page.png', fullPage: true });
      throw error;
    }
  });
});
