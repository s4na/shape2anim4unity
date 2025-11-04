// File handling utilities
import { CONFIG } from '../config.js';

export class FileHandler {
    /**
     * Read a file as text
     * @param {File} file - The file to read
     * @returns {Promise<string>} - File content as text
     */
    static readAsText(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('ファイルが提供されていません'));
                return;
            }

            // Check file size
            if (file.size > CONFIG.MAX_FILE_SIZE) {
                reject(new Error(CONFIG.VALIDATION_MESSAGES.FILE_TOO_LARGE));
                return;
            }

            // Check file extension
            const fileName = file.name.toLowerCase();
            const hasValidExtension = CONFIG.ALLOWED_EXTENSIONS.some(ext =>
                fileName.endsWith(ext)
            );

            if (!hasValidExtension) {
                reject(new Error(CONFIG.VALIDATION_MESSAGES.INVALID_FILE_TYPE));
                return;
            }

            const reader = new FileReader();

            reader.onload = (event) => {
                resolve(event.target.result);
            };

            reader.onerror = () => {
                reject(new Error('ファイルの読み込みに失敗しました'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Download text content as a file
     * @param {string} content - The content to download
     * @param {string} filename - The filename for the download
     */
    static downloadAsFile(content, filename = CONFIG.DEFAULT_FILENAME) {
        try {
            // Ensure filename has .anim extension
            if (!filename.toLowerCase().endsWith('.anim')) {
                filename += '.anim';
            }

            // Create blob
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Download failed:', error);
            return false;
        }
    }

    /**
     * Format file size for display
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 バイト';

        const k = 1024;
        const sizes = ['バイト', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Validate file before processing
     * @param {File} file - The file to validate
     * @returns {Object} - Validation result {valid: boolean, error: string}
     */
    static validateFile(file) {
        if (!file) {
            return { valid: false, error: 'ファイルが提供されていません' };
        }

        if (file.size > CONFIG.MAX_FILE_SIZE) {
            return { valid: false, error: CONFIG.VALIDATION_MESSAGES.FILE_TOO_LARGE };
        }

        const fileName = file.name.toLowerCase();
        const hasValidExtension = CONFIG.ALLOWED_EXTENSIONS.some(ext =>
            fileName.endsWith(ext)
        );

        if (!hasValidExtension) {
            return { valid: false, error: CONFIG.VALIDATION_MESSAGES.INVALID_FILE_TYPE };
        }

        return { valid: true, error: null };
    }
}
