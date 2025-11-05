import { test, expect } from '@playwright/test';

test.describe('Text to File Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to Text to File tab
    await page.click('[data-tab="text-to-file"]');
    await expect(page.locator('#text-to-file')).toBeVisible();
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle('Unity Animation Editor');
    await expect(page.locator('.app-header h1')).toContainText('Unity Animation Editor');
  });

  test('should show validation status as "No content" initially', async ({ page }) => {
    const statusText = page.locator('#validation-status .status-text');
    await expect(statusText).toContainText('No content');
  });

  test('should disable download button when textarea is empty', async ({ page }) => {
    const downloadButton = page.locator('#download-button');
    await expect(downloadButton).toBeDisabled();
  });

  test('should validate YAML content and enable download button', async ({ page }) => {
    const textarea = page.locator('#animation-text');
    const validYAML = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!74 &7400000
AnimationClip:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_Name: TestAnimation`;

    await textarea.fill(validYAML);

    // Wait for validation
    await page.waitForTimeout(500);

    const downloadButton = page.locator('#download-button');
    await expect(downloadButton).toBeEnabled();
  });

  test('should show error for invalid YAML format', async ({ page }) => {
    const textarea = page.locator('#animation-text');
    const invalidYAML = 'This is not valid YAML for Unity animation';

    await textarea.fill(invalidYAML);

    // Wait for validation
    await page.waitForTimeout(500);

    const statusText = page.locator('#validation-status .status-text');
    // Should show some error or invalid status (not "Valid")
    const text = await statusText.textContent();
    expect(text).not.toContain('Valid');
  });

  test('should update filename input', async ({ page }) => {
    const filenameInput = page.locator('#filename-input');

    await filenameInput.clear();
    await filenameInput.fill('my-custom-animation');

    await expect(filenameInput).toHaveValue('my-custom-animation');
  });

  test('should clear textarea when clear button is clicked', async ({ page }) => {
    const textarea = page.locator('#animation-text');
    const clearButton = page.locator('#clear-button');

    await textarea.fill('Some test content');
    await expect(textarea).toHaveValue('Some test content');

    await clearButton.click();
    await expect(textarea).toHaveValue('');
  });

  test('should download file when download button is clicked with valid content', async ({ page }) => {
    const textarea = page.locator('#animation-text');
    const validYAML = `%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!74 &7400000
AnimationClip:
  m_ObjectHideFlags: 0
  m_Name: TestAnimation`;

    await textarea.fill(validYAML);

    // Wait for validation
    await page.waitForTimeout(500);

    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');

    const downloadButton = page.locator('#download-button');
    await downloadButton.click();

    // Wait for download to start
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toContain('.anim');
  });
});
