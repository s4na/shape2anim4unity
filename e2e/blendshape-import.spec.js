import { test, expect } from '@playwright/test';

test.describe('BlendShape Import', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to BlendShape Import tab (should be active by default)
    const blendShapeTab = page.locator('[data-tab="blendshape-import"]');
    await blendShapeTab.click();
    await expect(page.locator('#blendshape-import')).toBeVisible();
  });

  test('should load BlendShape Import tab', async ({ page }) => {
    await expect(page.locator('#blendshape-import h2')).toContainText('BlendShape Weight Importer');
  });

  test('should show "No content" status initially', async ({ page }) => {
    const statusText = page.locator('#blendshape-validation-text');
    await expect(statusText).toContainText('No content');
  });

  test('should disable generate button when textarea is empty', async ({ page }) => {
    const generateButton = page.locator('#blendshape-generate-button');
    await expect(generateButton).toBeDisabled();
  });

  test('should validate JSON content and enable generate button', async ({ page }) => {
    const textarea = page.locator('#blendshape-json-input');
    const validJSON = `GenericPropertyJSON:{"name":"m_BlendShapeWeights","type":-1,"arraySize":3,"arrayType":"float","data":[{"index":0,"value":50.5},{"index":1,"value":25.0},{"index":2,"value":0.0}]}`;

    await textarea.fill(validJSON);

    // Wait for validation
    await page.waitForTimeout(500);

    const generateButton = page.locator('#blendshape-generate-button');
    await expect(generateButton).toBeEnabled();
  });

  test('should show blendshape info after valid JSON input', async ({ page }) => {
    const textarea = page.locator('#blendshape-json-input');
    const validJSON = `GenericPropertyJSON:{"name":"m_BlendShapeWeights","type":-1,"arraySize":3,"arrayType":"float","data":[{"index":0,"value":50.5},{"index":1,"value":25.0},{"index":2,"value":0.0}]}`;

    await textarea.fill(validJSON);

    // Wait for validation
    await page.waitForTimeout(500);

    const infoSection = page.locator('#blendshape-info-section');
    await expect(infoSection).toBeVisible();

    const blendshapeCount = page.locator('#blendshape-count');
    await expect(blendshapeCount).toContainText('3');
  });

  test('should update animation name input', async ({ page }) => {
    const nameInput = page.locator('#blendshape-animation-name');

    await nameInput.clear();
    await nameInput.fill('MyCustomAnimation');

    await expect(nameInput).toHaveValue('MyCustomAnimation');
  });

  test('should toggle multi-frame mode', async ({ page }) => {
    const multiFrameCheckbox = page.locator('#blendshape-multi-frame');
    const singleFrameOptions = page.locator('#single-frame-options');
    const multiFrameOptions = page.locator('#multi-frame-options');

    // Initially, single-frame should be visible, multi-frame hidden
    await expect(singleFrameOptions).toBeVisible();
    await expect(multiFrameOptions).not.toBeVisible();

    // Click multi-frame checkbox
    await multiFrameCheckbox.click();

    // Now multi-frame should be visible, single-frame hidden
    await expect(singleFrameOptions).not.toBeVisible();
    await expect(multiFrameOptions).toBeVisible();
  });

  test('should clear textarea when clear button is clicked', async ({ page }) => {
    const textarea = page.locator('#blendshape-json-input');
    const clearButton = page.locator('#blendshape-clear-button');

    await textarea.fill('Some test content');
    await expect(textarea).toHaveValue('Some test content');

    await clearButton.click();
    await expect(textarea).toHaveValue('');
  });

  test('should generate animation and show download button', async ({ page }) => {
    const textarea = page.locator('#blendshape-json-input');
    const validJSON = `GenericPropertyJSON:{"name":"m_BlendShapeWeights","type":-1,"arraySize":3,"arrayType":"float","data":[{"index":0,"value":50.5},{"index":1,"value":25.0},{"index":2,"value":0.0}]}`;

    await textarea.fill(validJSON);

    // Wait for validation
    await page.waitForTimeout(500);

    const generateButton = page.locator('#blendshape-generate-button');
    await generateButton.click();

    // Wait for generation
    await page.waitForTimeout(500);

    const downloadButton = page.locator('#blendshape-download-button');
    await expect(downloadButton).toBeVisible();
  });

  test('should download animation file', async ({ page }) => {
    const textarea = page.locator('#blendshape-json-input');
    const validJSON = `GenericPropertyJSON:{"name":"m_BlendShapeWeights","type":-1,"arraySize":3,"arrayType":"float","data":[{"index":0,"value":50.5},{"index":1,"value":25.0},{"index":2,"value":0.0}]}`;

    await textarea.fill(validJSON);
    await page.waitForTimeout(500);

    const generateButton = page.locator('#blendshape-generate-button');
    await generateButton.click();
    await page.waitForTimeout(500);

    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');

    const downloadButton = page.locator('#blendshape-download-button');
    await downloadButton.click();

    // Wait for download to start
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toContain('.anim');
  });
});
