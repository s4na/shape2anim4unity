import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { FileHandler } from '../js/utils/FileHandler.js';

describe('FileHandler', () => {
  describe('readAsText', () => {
    test('should reject when no file provided', async () => {
      await expect(FileHandler.readAsText(null)).rejects.toThrow('No file provided');
    });

    test('should reject file that is too large', async () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.anim', {
        type: 'text/plain'
      });

      await expect(FileHandler.readAsText(largeFile)).rejects.toThrow('too large');
    });

    test('should reject invalid file extension', async () => {
      const invalidFile = new File(['content'], 'test.txt', {
        type: 'text/plain'
      });

      await expect(FileHandler.readAsText(invalidFile)).rejects.toThrow('Invalid file type');
    });

    test('should read valid .anim file', async () => {
      const content = '%YAML 1.1\ntest content';
      const file = new File([content], 'test.anim', {
        type: 'text/plain'
      });

      const result = await FileHandler.readAsText(file);
      expect(result).toBe(content);
    });
  });

  describe('downloadAsFile', () => {
    test('should return true for successful download', () => {
      const content = 'test content';
      const filename = 'test.anim';

      // Mock URL.createObjectURL and revokeObjectURL
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;

      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();

      const result = FileHandler.downloadAsFile(content, filename);

      expect(result).toBe(true);

      // Restore original functions
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });

    test('should return true when filename has no extension', () => {
      const content = 'test content';
      const filename = 'test';

      // Mock URL methods
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;

      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();

      const result = FileHandler.downloadAsFile(content, filename);

      expect(result).toBe(true);

      // Restore original functions
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });

    test('should handle default filename', () => {
      const content = 'test content';

      // Mock URL methods
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;

      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();

      const result = FileHandler.downloadAsFile(content);

      expect(result).toBe(true);

      // Restore original functions
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });
  });

  describe('formatFileSize', () => {
    test('should format 0 bytes', () => {
      expect(FileHandler.formatFileSize(0)).toBe('0 Bytes');
    });

    test('should format bytes', () => {
      expect(FileHandler.formatFileSize(500)).toBe('500 Bytes');
    });

    test('should format kilobytes', () => {
      const result = FileHandler.formatFileSize(1024);
      expect(result).toContain('KB');
    });

    test('should format megabytes', () => {
      const result = FileHandler.formatFileSize(1024 * 1024);
      expect(result).toContain('MB');
    });

    test('should format gigabytes', () => {
      const result = FileHandler.formatFileSize(1024 * 1024 * 1024);
      expect(result).toContain('GB');
    });

    test('should round to 2 decimal places', () => {
      const result = FileHandler.formatFileSize(1536); // 1.5 KB
      expect(result).toBe('1.5 KB');
    });
  });

  describe('validateFile', () => {
    test('should reject null file', () => {
      const result = FileHandler.validateFile(null);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('No file');
    });

    test('should reject file that is too large', () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.anim', {
        type: 'text/plain'
      });

      const result = FileHandler.validateFile(largeFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
    });

    test('should reject invalid file extension', () => {
      const invalidFile = new File(['content'], 'test.txt', {
        type: 'text/plain'
      });

      const result = FileHandler.validateFile(invalidFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    test('should accept valid .anim file', () => {
      const validFile = new File(['content'], 'test.anim', {
        type: 'text/plain'
      });

      const result = FileHandler.validateFile(validFile);

      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should handle uppercase extension', () => {
      const validFile = new File(['content'], 'test.ANIM', {
        type: 'text/plain'
      });

      const result = FileHandler.validateFile(validFile);

      expect(result.valid).toBe(true);
    });
  });
});
