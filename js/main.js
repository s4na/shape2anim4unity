// Main Application Entry Point
import { BlendShapeUI } from './ui/BlendShapeUI.js';

// Application class
class UnityBlendShapeImporter {
    constructor() {
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

    initializeApp() {
        console.log('Unity BlendShape Importer initializing...');

        try {
            // Initialize BlendShape UI
            this.blendShapeUI = new BlendShapeUI();

            console.log('Unity BlendShape Importer initialized successfully');
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
const app = new UnityBlendShapeImporter();

// Export for debugging
window.UnityBlendShapeImporter = app;
