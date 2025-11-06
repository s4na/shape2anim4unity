// Main Application Entry Point
import { BlendShapeUI } from './ui/BlendShapeUI.js';
import { LocalizationManager } from './ui/LocalizationManager.js';

// Application class
class UnityBlendShapeImporter {
    constructor() {
        this.blendShapeUI = null;
        this.localizationManager = null;
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
        console.log('Unity BlendShape Importer initializing...');

        try {
            // Initialize Localization Manager
            this.localizationManager = new LocalizationManager();
            await this.localizationManager.init();

            // Make localization manager globally available
            window.localizationManager = this.localizationManager;

            // Initialize BlendShape UI
            this.blendShapeUI = new BlendShapeUI(this.localizationManager);

            console.log('Unity BlendShape Importer initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            // Use localized error message if available
            const errorMessage = this.localizationManager?.t('errors.initFailed') ||
                                  'Application failed to initialize. Please refresh the page.';
            this.showError(errorMessage);
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
const app = new UnityBlendShapeImporter();

// Export for debugging
window.UnityBlendShapeImporter = app;
