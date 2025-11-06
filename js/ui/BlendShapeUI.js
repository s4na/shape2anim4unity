// BlendShape UI Controller
// Handles user interface for BlendShape weight import

import { BlendShapeWeightImporter } from '../processors/BlendShapeWeightImporter.js';
import { FileHandler } from '../utils/FileHandler.js';

export class BlendShapeUI {
    constructor(localizationManager = null) {
        this.localizationManager = localizationManager;
        this.initializeElements();
        this.attachEventListeners();
        this.resetState();
    }

    initializeElements() {
        // Text input
        this.jsonInput = document.getElementById('blendshape-json-input');
        this.errorDisplay = document.getElementById('blendshape-error-display');

        // Options
        this.excludeZerosCheckbox = document.getElementById('blendshape-exclude-zeros');

        // Buttons
        this.downloadButton = document.getElementById('blendshape-download-button');
    }

    attachEventListeners() {
        // Input validation and auto-generation
        this.jsonInput.addEventListener('input', () => this.handleInputChange());

        // Exclude zeros toggle
        this.excludeZerosCheckbox.addEventListener('change', () => this.handleInputChange());

        // Download button
        this.downloadButton.addEventListener('click', () => this.handleDownload());
    }

    resetState() {
        this.parsedData = null;
        this.generatedYAML = null;
        this.downloadButton.style.display = 'none';
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
    }

    handleInputChange() {
        const content = this.jsonInput.value.trim();

        if (!content) {
            this.downloadButton.style.display = 'none';
            this.errorDisplay.textContent = '';
            this.errorDisplay.style.display = 'none';
            return;
        }

        try {
            // Parse the JSON
            const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(content);
            this.parsedData = { blendShapeData };

            // Get exclude zeros option
            const excludeZeros = this.excludeZerosCheckbox.checked;

            // Auto-generate animation
            this.generatedYAML = BlendShapeWeightImporter.createStaticAnimation(
                blendShapeData,
                {
                    animationName: 'BlendShapeAnimation',
                    meshPath: '',
                    sampleRate: 60,
                    duration: 1.0,
                    excludeZeros
                }
            );

            // Show download button
            this.downloadButton.style.display = 'inline-flex';

            // Clear errors
            this.errorDisplay.textContent = '';
            this.errorDisplay.style.display = 'none';
        } catch (error) {
            const errorPrefix = this.localizationManager?.t('blendShapeImport.errorPrefix') || 'Error: ';
            this.errorDisplay.textContent = `${errorPrefix}${error.message}`;
            this.errorDisplay.style.display = 'block';
            this.downloadButton.style.display = 'none';
        }
    }

    handleDownload() {
        if (!this.generatedYAML) {
            return;
        }

        const filename = 'BlendShapeAnimation.anim';
        FileHandler.downloadAsFile(this.generatedYAML, filename);
    }
}
