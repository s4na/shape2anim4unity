import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe('BlendShape Import E2E Test', () => {
  test('should import BlendShape weights from text file and generate animation', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Unity Animation Editor');

    // Click on the BlendShape Import tab
    const blendShapeTab = page.locator('button[data-tab="blendshape-import"]');
    await blendShapeTab.click();

    // Wait for the tab content to be visible
    await expect(page.locator('#blendshape-import')).toBeVisible();

    // Read the test data from the fixture file
    const testDataPath = join(__dirname, '../fixtures/blendshape-sample.txt');
    const testData = readFileSync(testDataPath, 'utf-8');

    // Find the textarea and paste the test data
    const jsonInput = page.locator('#blendshape-json-input');
    await jsonInput.fill(testData);

    // Wait a moment for validation to complete
    await page.waitForTimeout(500);

    // Check that validation succeeded
    const validationStatus = page.locator('#blendshape-validation-status');
    await expect(validationStatus).toContainText('Valid BlendShapeWeights format');
    await expect(validationStatus).toHaveClass(/valid/);

    // Check that the info section is displayed with correct data
    const infoSection = page.locator('#blendshape-info-section');
    await expect(infoSection).toBeVisible();

    const blendShapeCount = page.locator('#blendshape-count');
    await expect(blendShapeCount).toContainText('512'); // 513 values - 1 for size

    const nonZeroCount = page.locator('#blendshape-nonzero-count');
    // Should have several non-zero values based on the test data
    const nonZeroText = await nonZeroCount.textContent();
    expect(parseInt(nonZeroText)).toBeGreaterThan(0);

    // Check that generate button is enabled
    const generateButton = page.locator('#blendshape-generate-button');
    await expect(generateButton).toBeEnabled();

    // Click the generate button
    await generateButton.click();

    // Wait for generation to complete
    await page.waitForTimeout(500);

    // Check that download button is now visible
    const downloadButton = page.locator('#blendshape-download-button');
    await expect(downloadButton).toBeVisible();

    // Verify no errors are displayed
    const errorDisplay = page.locator('#blendshape-error-display');
    await expect(errorDisplay).not.toBeVisible();
  });

  test('should validate and parse animation name and mesh path options', async ({ page }) => {
    await page.goto('/');

    // Click on the BlendShape Import tab
    const blendShapeTab = page.locator('button[data-tab="blendshape-import"]');
    await blendShapeTab.click();

    // Read the test data
    const testDataPath = join(__dirname, '../fixtures/blendshape-sample.txt');
    const testData = readFileSync(testDataPath, 'utf-8');

    // Fill in the textarea
    const jsonInput = page.locator('#blendshape-json-input');
    await jsonInput.fill(testData);

    // Set custom animation name and mesh path
    const animationNameInput = page.locator('#blendshape-animation-name');
    await animationNameInput.fill('TestBlendShapeAnimation');

    const meshPathInput = page.locator('#blendshape-mesh-path');
    await meshPathInput.fill('Character/Body/Face');

    const sampleRateInput = page.locator('#blendshape-sample-rate');
    await sampleRateInput.fill('30');

    // Generate animation
    const generateButton = page.locator('#blendshape-generate-button');
    await generateButton.click();

    await page.waitForTimeout(500);

    // Verify download button is visible
    const downloadButton = page.locator('#blendshape-download-button');
    await expect(downloadButton).toBeVisible();
  });

  test('should handle invalid JSON gracefully', async ({ page }) => {
    await page.goto('/');

    // Click on the BlendShape Import tab
    const blendShapeTab = page.locator('button[data-tab="blendshape-import"]');
    await blendShapeTab.click();

    // Enter invalid JSON
    const jsonInput = page.locator('#blendshape-json-input');
    await jsonInput.fill('invalid json data {{{');

    await page.waitForTimeout(500);

    // Check that validation failed
    const validationStatus = page.locator('#blendshape-validation-status');
    await expect(validationStatus).toContainText('Invalid format');
    await expect(validationStatus).toHaveClass(/invalid/);

    // Check that error message is displayed
    const errorDisplay = page.locator('#blendshape-error-display');
    await expect(errorDisplay).toBeVisible();
    await expect(errorDisplay).toContainText('Error:');

    // Check that generate button is disabled
    const generateButton = page.locator('#blendshape-generate-button');
    await expect(generateButton).toBeDisabled();
  });

  test('should clear all data when clear button is clicked', async ({ page }) => {
    await page.goto('/');

    // Click on the BlendShape Import tab
    const blendShapeTab = page.locator('button[data-tab="blendshape-import"]');
    await blendShapeTab.click();

    // Read the test data
    const testDataPath = join(__dirname, '../fixtures/blendshape-sample.txt');
    const testData = readFileSync(testDataPath, 'utf-8');

    // Fill in data
    const jsonInput = page.locator('#blendshape-json-input');
    await jsonInput.fill(testData);

    await page.waitForTimeout(500);

    // Click clear button
    const clearButton = page.locator('#blendshape-clear-button');
    await clearButton.click();

    // Verify everything is cleared
    await expect(jsonInput).toHaveValue('');

    const validationStatus = page.locator('#blendshape-validation-status');
    await expect(validationStatus).toContainText('No content');

    const generateButton = page.locator('#blendshape-generate-button');
    await expect(generateButton).toBeDisabled();
  });

  test('should parse multi-frame animation data', async ({ page }) => {
    await page.goto('/');

    // Click on the BlendShape Import tab
    const blendShapeTab = page.locator('button[data-tab="blendshape-import"]');
    await blendShapeTab.click();

    // Enable multi-frame mode
    const multiFrameCheckbox = page.locator('#blendshape-multi-frame');
    await multiFrameCheckbox.check();

    // Wait for UI to update
    await page.waitForTimeout(200);

    // Verify multi-frame options are visible
    const multiFrameOptions = page.locator('#multi-frame-options');
    await expect(multiFrameOptions).toBeVisible();

    const singleFrameOptions = page.locator('#single-frame-options');
    await expect(singleFrameOptions).not.toBeVisible();

    // Read test data and duplicate it for multiple frames
    const testDataPath = join(__dirname, '../fixtures/blendshape-sample.txt');
    const testData = readFileSync(testDataPath, 'utf-8');
    const multiFrameData = testData + '\n' + testData + '\n' + testData;

    // Fill in multi-frame data
    const jsonInput = page.locator('#blendshape-json-input');
    await jsonInput.fill(multiFrameData);

    await page.waitForTimeout(500);

    // Check validation
    const validationStatus = page.locator('#blendshape-validation-status');
    await expect(validationStatus).toContainText('Valid - 3 frames found');

    // Check frame count
    const frameCount = page.locator('#blendshape-frame-count');
    await expect(frameCount).toContainText('3');

    // Generate animation
    const generateButton = page.locator('#blendshape-generate-button');
    await expect(generateButton).toBeEnabled();
    await generateButton.click();

    await page.waitForTimeout(500);

    // Verify download button is visible
    const downloadButton = page.locator('#blendshape-download-button');
    await expect(downloadButton).toBeVisible();
  });
});
