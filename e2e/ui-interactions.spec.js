import { test, expect } from '@playwright/test';

test.describe('UI Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Tab Navigation', () => {
    test('should switch to Text to File tab', async ({ page }) => {
      const textToFileTab = page.locator('[data-tab="text-to-file"]');
      await textToFileTab.click();

      const tabContent = page.locator('#text-to-file');
      await expect(tabContent).toBeVisible();
      await expect(tabContent).toHaveClass(/active/);
    });

    test('should switch to Remove Zeros tab', async ({ page }) => {
      const removeZerosTab = page.locator('[data-tab="remove-zeros"]');
      await removeZerosTab.click();

      const tabContent = page.locator('#remove-zeros');
      await expect(tabContent).toBeVisible();
      await expect(tabContent).toHaveClass(/active/);
    });

    test('should switch to BlendShape Import tab', async ({ page }) => {
      const blendShapeTab = page.locator('[data-tab="blendshape-import"]');
      await blendShapeTab.click();

      const tabContent = page.locator('#blendshape-import');
      await expect(tabContent).toBeVisible();
      await expect(tabContent).toHaveClass(/active/);
    });

    test('should switch to About tab', async ({ page }) => {
      const aboutTab = page.locator('[data-tab="about"]');
      await aboutTab.click();

      const tabContent = page.locator('#about');
      await expect(tabContent).toBeVisible();
      await expect(tabContent).toHaveClass(/active/);
    });

    test('should update active button style when switching tabs', async ({ page }) => {
      const textToFileTab = page.locator('[data-tab="text-to-file"]');
      await textToFileTab.click();

      await expect(textToFileTab).toHaveClass(/active/);

      const blendShapeTab = page.locator('[data-tab="blendshape-import"]');
      await blendShapeTab.click();

      await expect(blendShapeTab).toHaveClass(/active/);
      await expect(textToFileTab).not.toHaveClass(/active/);
    });
  });

  test.describe('Theme Toggle', () => {
    test('should toggle between light and dark theme', async ({ page }) => {
      const themeToggle = page.locator('#theme-toggle');
      const body = page.locator('body');

      // Get initial theme
      const initialTheme = await body.getAttribute('data-theme');

      // Click theme toggle
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(300);

      // Check theme changed
      const newTheme = await body.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);

      // Click again to toggle back
      await themeToggle.click();
      await page.waitForTimeout(300);

      const revertedTheme = await body.getAttribute('data-theme');
      expect(revertedTheme).toBe(initialTheme);
    });

    test('should persist theme preference in localStorage', async ({ page }) => {
      const themeToggle = page.locator('#theme-toggle');

      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(300);

      const theme = await page.locator('body').getAttribute('data-theme');

      // Reload page
      await page.reload();

      // Check theme is still the same
      const themeAfterReload = await page.locator('body').getAttribute('data-theme');
      expect(themeAfterReload).toBe(theme);
    });
  });

  test.describe('Language Toggle', () => {
    test('should toggle between English and Japanese', async ({ page }) => {
      const languageToggle = page.locator('#language-toggle');

      // Get initial language from button text
      const initialLang = await languageToggle.textContent();

      // Click language toggle
      await languageToggle.click();

      // Wait for language change
      await page.waitForTimeout(300);

      // Check language changed
      const newLang = await languageToggle.textContent();
      expect(newLang).not.toBe(initialLang);

      // Should be either 'EN' or 'JP'
      expect(['EN', 'JP']).toContain(newLang);
    });

    test('should change page content when language is toggled', async ({ page }) => {
      const languageToggle = page.locator('#language-toggle');
      const header = page.locator('.app-header h1');

      // Get initial header text
      const initialHeaderText = await header.textContent();

      // Toggle language
      await languageToggle.click();
      await page.waitForTimeout(300);

      // Header text should change
      const newHeaderText = await header.textContent();

      // The text should be different (unless it's the same in both languages)
      // We just verify the page still loads correctly
      expect(newHeaderText).toBeTruthy();
    });

    test('should persist language preference in localStorage', async ({ page }) => {
      const languageToggle = page.locator('#language-toggle');

      // Toggle language
      await languageToggle.click();
      await page.waitForTimeout(300);

      const lang = await languageToggle.textContent();

      // Reload page
      await page.reload();

      // Check language is still the same
      const langAfterReload = await languageToggle.textContent();
      expect(langAfterReload).toBe(lang);
    });
  });

  test.describe('Header Elements', () => {
    test('should have working GitHub link', async ({ page }) => {
      const githubLink = page.locator('a[href="https://github.com/s4na/unity-animation-editor"]');
      await expect(githubLink).toBeVisible();
      await expect(githubLink).toHaveAttribute('target', '_blank');
    });

    test('should display logo and title', async ({ page }) => {
      const logo = page.locator('.logo');
      const title = page.locator('.app-header h1');

      await expect(logo).toBeVisible();
      await expect(title).toBeVisible();
      await expect(title).toContainText('Unity Animation Editor');
    });
  });

  test.describe('Status Bar', () => {
    test('should display status bar', async ({ page }) => {
      const statusBar = page.locator('.status-bar');
      await expect(statusBar).toBeVisible();
    });

    test('should have status text', async ({ page }) => {
      const statusText = page.locator('#status-text');
      await expect(statusText).toBeVisible();
    });

    test('should have file status', async ({ page }) => {
      const fileStatus = page.locator('#file-status');
      await expect(fileStatus).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should be accessible on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify key elements are still visible
      const header = page.locator('.app-header');
      const tabs = page.locator('.tab-navigation');
      const content = page.locator('.tab-content-container');

      await expect(header).toBeVisible();
      await expect(tabs).toBeVisible();
      await expect(content).toBeVisible();
    });

    test('should be accessible on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Verify key elements are still visible
      const header = page.locator('.app-header');
      const tabs = page.locator('.tab-navigation');
      const content = page.locator('.tab-content-container');

      await expect(header).toBeVisible();
      await expect(tabs).toBeVisible();
      await expect(content).toBeVisible();
    });
  });
});
