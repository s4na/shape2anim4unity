import { describe, test, expect, beforeEach } from '@jest/globals';
import { FileHandler } from '../js/utils/FileHandler.js';

describe('FileHandler', () => {
  describe('readAsText', () => {
    test('should read file as text', async () => {
      const content = 'test content';
      const file = new File([content], 'test.anim', { type: 'text/plain' });

      const result = await FileHandler.readAsText(file);

      expect(result).toBe(content);
    });

    test('should reject when no file is provided', async () => {
      await expect(FileHandler.readAsText(null)).rejects.toThrow('No file provided');
    });

    test('should reject file that is too large', async () => {
      const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
      const file = new File([largeContent], 'test.anim', { type: 'text/plain' });

      await expect(FileHandler.readAsText(file)).rejects.toThrow('too large');
    });

    test('should reject invalid file extension', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      await expect(FileHandler.readAsText(file)).rejects.toThrow('Invalid file type');
    });

    test('should accept .anim extension', async () => {
      const file = new File(['content'], 'animation.anim', { type: 'text/plain' });

      const result = await FileHandler.readAsText(file);

      expect(result).toBe('content');
    });
  });

  describe('formatFileSize', () => {
    test('should format bytes', () => {
      expect(FileHandler.formatFileSize(0)).toBe('0 Bytes');
      expect(FileHandler.formatFileSize(100)).toBe('100 Bytes');
    });

    test('should format kilobytes', () => {
      expect(FileHandler.formatFileSize(1024)).toBe('1 KB');
      expect(FileHandler.formatFileSize(1536)).toBe('1.5 KB');
    });

    test('should format megabytes', () => {
      expect(FileHandler.formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(FileHandler.formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });

    test('should format gigabytes', () => {
      expect(FileHandler.formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('validateFile', () => {
    test('should validate correct file', () => {
      const file = new File(['content'], 'test.anim', { type: 'text/plain' });

      const result = FileHandler.validateFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject null file', () => {
      const result = FileHandler.validateFile(null);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('No file provided');
    });

    test('should reject file that is too large', () => {
      const largeContent = 'x'.repeat(11 * 1024 * 1024);
      const file = new File([largeContent], 'test.anim', { type: 'text/plain' });

      const result = FileHandler.validateFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
    });

    test('should reject invalid file extension', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      const result = FileHandler.validateFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    test('should accept .anim extension regardless of case', () => {
      const file1 = new File(['content'], 'test.anim', { type: 'text/plain' });
      const file2 = new File(['content'], 'test.ANIM', { type: 'text/plain' });

      expect(FileHandler.validateFile(file1).valid).toBe(true);
      expect(FileHandler.validateFile(file2).valid).toBe(true);
    });
  });

  describe('downloadAsFile', () => {
    let createElement;
    let createObjectURL;
    let revokeObjectURL;
    let appendChild;
    let removeChild;

    beforeEach(() => {
      // Mock DOM APIs
      const mockLink = {
        href: '',
        download: '',
        click: () => {}
      };

      createElement = document.createElement;
      document.createElement = (tag) => {
        if (tag === 'a') return mockLink;
        return createElement.call(document, tag);
      };

      createObjectURL = URL.createObjectURL;
      URL.createObjectURL = () => 'blob:mock-url';

      revokeObjectURL = URL.revokeObjectURL;
      URL.revokeObjectURL = () => {};

      appendChild = document.body.appendChild;
      document.body.appendChild = () => {};

      removeChild = document.body.removeChild;
      document.body.removeChild = () => {};
    });

    test('should create download with correct filename', () => {
      const result = FileHandler.downloadAsFile('content', 'test');

      expect(result).toBe(true);
    });

    test('should add .anim extension if missing', () => {
      const mockLink = {
        href: '',
        download: '',
        click: () => {}
      };

      document.createElement = (tag) => {
        if (tag === 'a') return mockLink;
        return createElement.call(document, tag);
      };

      FileHandler.downloadAsFile('content', 'test');

      expect(mockLink.download).toBe('test.anim');
    });

    test('should not duplicate .anim extension', () => {
      const mockLink = {
        href: '',
        download: '',
        click: () => {}
      };

      document.createElement = (tag) => {
        if (tag === 'a') return mockLink;
        return createElement.call(document, tag);
      };

      FileHandler.downloadAsFile('content', 'test.anim');

      expect(mockLink.download).toBe('test.anim');
    });
  });
});
