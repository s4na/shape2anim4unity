// Main Application Entry Point
import { TabManager } from './ui/TabManager.js';
import { ThemeManager } from './ui/ThemeManager.js';
import { LocalizationManager } from './ui/LocalizationManager.js';
import { TextToFileUI } from './ui/TextToFileUI.js';
import { RemoveZerosUI } from './ui/RemoveZerosUI.js';
import { BlendShapeUI } from './ui/BlendShapeUI.js';

// Application class
class UnityAnimationEditor {
    constructor() {
        this.tabManager = null;
        this.themeManager = null;
        this.localizationManager = null;
        this.textToFileUI = null;
        this.removeZerosUI = null;
        this.blendShapeUI = null;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    async initializeApp() {
        console.log('Unity Animation Editor initializing...');

        try {
            // Initialize managers
            this.themeManager = new ThemeManager();

            // Initialize localization (async)
            this.localizationManager = new LocalizationManager();
            await this.localizationManager.init();

            this.tabManager = new TabManager();

            // Initialize UI controllers for each tab
            this.textToFileUI = new TextToFileUI();
            this.removeZerosUI = new RemoveZerosUI();
            this.blendShapeUI = new BlendShapeUI();

            console.log('Unity Animation Editor initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Application failed to initialize. Please refresh the page.');
        }
    }

    showError(message) {
        // Simple error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background-color: #D32F2F;
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize the application
const app = new UnityAnimationEditor();

// Export for debugging
window.UnityAnimationEditor = app;
