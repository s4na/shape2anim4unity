// Text to File Converter UI Controller
import { AnimationParser } from '../parsers/AnimationParser.js';
import { FileHandler } from '../utils/FileHandler.js';
import { CONFIG } from '../config.js';

export class TextToFileUI {
    constructor() {
        this.textArea = null;
        this.validationStatus = null;
        this.statusIndicator = null;
        this.statusText = null;
        this.errorDisplay = null;
        this.filenameInput = null;
        this.downloadButton = null;
        this.clearButton = null;
        this.validationTimeout = null;

        this.currentContent = '';
        this.isValid = false;

        this.init();
    }

    init() {
        // Get DOM elements
        this.textArea = document.getElementById('animation-text');
        this.validationStatus = document.getElementById('validation-status');
        this.statusIndicator = this.validationStatus?.querySelector('.status-indicator');
        this.statusText = this.validationStatus?.querySelector('.status-text');
        this.errorDisplay = document.getElementById('error-display');
        this.filenameInput = document.getElementById('filename-input');
        this.downloadButton = document.getElementById('download-button');
        this.clearButton = document.getElementById('clear-button');

        if (!this.textArea) return;

        // Add event listeners
        this.textArea.addEventListener('input', () => this.handleInput());
        this.downloadButton?.addEventListener('click', () => this.handleDownload());
        this.clearButton?.addEventListener('click', () => this.handleClear());

        // Auto-extract filename from content
        this.textArea.addEventListener('input', () => this.updateFilenameFromContent());

        // Initial validation
        this.validateContent();
    }

    handleInput() {
        this.currentContent = this.textArea.value;

        // Debounce validation
        clearTimeout(this.validationTimeout);
        this.validationTimeout = setTimeout(() => {
            this.validateContent();
        }, CONFIG.VALIDATION_DEBOUNCE);
    }

    validateContent() {
        const content = this.currentContent.trim();

        if (!content) {
            this.updateValidationUI('none', CONFIG.VALIDATION_MESSAGES.NO_CONTENT);
            this.isValid = false;
            this.downloadButton.disabled = true;
            this.hideError();
            return;
        }

        const validation = AnimationParser.validate(content);

        if (validation.valid) {
            this.updateValidationUI('valid', CONFIG.VALIDATION_MESSAGES.VALID);
            this.isValid = true;
            this.downloadButton.disabled = false;
            this.hideError();
        } else {
            this.updateValidationUI('invalid', 'Invalid format');
            this.isValid = false;
            this.downloadButton.disabled = true;
            this.showErrors(validation.errors);
        }
    }

    updateValidationUI(state, message) {
        if (!this.validationStatus) return;

        // Remove all state classes
        this.validationStatus.classList.remove('valid', 'invalid', 'warning');

        // Add new state class
        if (state !== 'none') {
            this.validationStatus.classList.add(state);
        }

        // Update text
        if (this.statusText) {
            this.statusText.textContent = message;
        }

        // Update status bar
        this.updateStatusBar(state, message);
    }

    updateStatusBar(state, message) {
        const statusText = document.getElementById('status-text');
        if (statusText) {
            if (state === 'valid') {
                statusText.textContent = 'ダウンロード可能';
            } else if (state === 'invalid') {
                statusText.textContent = '無効な形式';
            } else {
                statusText.textContent = '準備完了';
            }
        }
    }

    showErrors(errors) {
        if (!this.errorDisplay) return;

        if (errors.length > 0) {
            this.errorDisplay.innerHTML = `
                <strong>バリデーションエラー:</strong>
                <ul style="margin: 8px 0 0 20px;">
                    ${errors.map(err => `<li>${err}</li>`).join('')}
                </ul>
            `;
            this.errorDisplay.classList.add('visible');
        } else {
            this.hideError();
        }
    }

    hideError() {
        if (this.errorDisplay) {
            this.errorDisplay.classList.remove('visible');
            this.errorDisplay.innerHTML = '';
        }
    }

    updateFilenameFromContent() {
        const content = this.currentContent;

        // Try to extract animation name
        const nameMatch = content.match(/m_Name:\s*(.+)/);
        if (nameMatch && nameMatch[1]) {
            let name = nameMatch[1].trim();
            // Remove any quotes or special characters
            name = name.replace(/['"]/g, '');
            if (name && this.filenameInput) {
                this.filenameInput.value = `${name}.anim`;
            }
        }
    }

    handleDownload() {
        if (!this.isValid) {
            return;
        }

        const content = this.currentContent;
        let filename = this.filenameInput?.value || CONFIG.DEFAULT_FILENAME;

        // Ensure .anim extension
        if (!filename.toLowerCase().endsWith('.anim')) {
            filename += '.anim';
        }

        const success = FileHandler.downloadAsFile(content, filename);

        if (success) {
            this.updateStatusBar('valid', `ダウンロード完了: ${filename}`);
            setTimeout(() => {
                this.updateStatusBar('valid', 'ダウンロード可能');
            }, 3000);
        } else {
            this.updateStatusBar('invalid', 'ダウンロード失敗');
        }
    }

    handleClear() {
        if (this.textArea) {
            this.textArea.value = '';
        }
        if (this.filenameInput) {
            this.filenameInput.value = CONFIG.DEFAULT_FILENAME;
        }

        this.currentContent = '';
        this.isValid = false;
        this.validateContent();
    }
}
