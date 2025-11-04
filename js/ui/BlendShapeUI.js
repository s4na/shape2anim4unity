// BlendShape UI Controller
// Handles user interface for BlendShape weight import

import { BlendShapeWeightImporter } from '../processors/BlendShapeWeightImporter.js';
import { FileHandler } from '../utils/FileHandler.js';

export class BlendShapeUI {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.resetState();
    }

    initializeElements() {
        // Text input
        this.jsonInput = document.getElementById('blendshape-json-input');
        this.validationStatus = document.getElementById('blendshape-validation-status');
        this.validationText = document.getElementById('blendshape-validation-text');
        this.errorDisplay = document.getElementById('blendshape-error-display');

        // Options
        this.animationNameInput = document.getElementById('blendshape-animation-name');
        this.meshPathInput = document.getElementById('blendshape-mesh-path');
        this.sampleRateInput = document.getElementById('blendshape-sample-rate');
        this.durationInput = document.getElementById('blendshape-duration');
        this.frameRateInput = document.getElementById('blendshape-frame-rate');
        this.multiFrameCheckbox = document.getElementById('blendshape-multi-frame');

        // Info display
        this.infoSection = document.getElementById('blendshape-info-section');
        this.blendShapeCount = document.getElementById('blendshape-count');
        this.nonZeroCount = document.getElementById('blendshape-nonzero-count');
        this.frameCount = document.getElementById('blendshape-frame-count');

        // Buttons
        this.clearButton = document.getElementById('blendshape-clear-button');
        this.generateButton = document.getElementById('blendshape-generate-button');
        this.downloadButton = document.getElementById('blendshape-download-button');
    }

    attachEventListeners() {
        // Input validation
        this.jsonInput.addEventListener('input', () => this.handleInputChange());

        // Multi-frame mode toggle
        this.multiFrameCheckbox.addEventListener('change', () => {
            const isMultiFrame = this.multiFrameCheckbox.checked;
            document.getElementById('single-frame-options').style.display = isMultiFrame ? 'none' : 'block';
            document.getElementById('multi-frame-options').style.display = isMultiFrame ? 'block' : 'none';
            this.handleInputChange();
        });

        // Buttons
        this.clearButton.addEventListener('click', () => this.handleClear());
        this.generateButton.addEventListener('click', () => this.handleGenerate());
        this.downloadButton.addEventListener('click', () => this.handleDownload());
    }

    resetState() {
        this.parsedData = null;
        this.generatedYAML = null;
        this.jsonInput.value = '';
        this.animationNameInput.value = 'BlendShapeAnimation';
        this.meshPathInput.value = '';
        this.sampleRateInput.value = '60';
        this.durationInput.value = '1.0';
        this.frameRateInput.value = '60';
        this.multiFrameCheckbox.checked = false;
        this.infoSection.style.display = 'none';
        this.downloadButton.style.display = 'none';
        this.generateButton.disabled = true;
        this.updateValidationStatus('No content', false);
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
        document.getElementById('single-frame-options').style.display = 'block';
        document.getElementById('multi-frame-options').style.display = 'none';
    }

    handleInputChange() {
        const content = this.jsonInput.value.trim();

        if (!content) {
            this.updateValidationStatus('No content', false);
            this.generateButton.disabled = true;
            this.infoSection.style.display = 'none';
            this.errorDisplay.textContent = '';
            this.errorDisplay.style.display = 'none';
            return;
        }

        try {
            if (this.multiFrameCheckbox.checked) {
                // Multi-frame mode
                const frameRate = parseFloat(this.frameRateInput.value) || 60;
                const frames = BlendShapeWeightImporter.parseMultipleFrames(content, frameRate);

                if (frames.length === 0) {
                    throw new Error('No valid frames found');
                }

                this.parsedData = { frames, isMultiFrame: true };
                this.updateValidationStatus(`Valid - ${frames.length} frames found`, true);
                this.showInfo(frames[0].values.length, frames.length);
                this.generateButton.disabled = false;
            } else {
                // Single frame mode
                const blendShapeData = BlendShapeWeightImporter.parseGenericPropertyJSON(content);
                this.parsedData = { blendShapeData, isMultiFrame: false };
                this.updateValidationStatus('Valid BlendShapeWeights format', true);
                this.showInfo(blendShapeData.values.length, 1);
                this.generateButton.disabled = false;
            }

            this.errorDisplay.textContent = '';
            this.errorDisplay.style.display = 'none';
        } catch (error) {
            this.updateValidationStatus('Invalid format', false);
            this.errorDisplay.textContent = `Error: ${error.message}`;
            this.errorDisplay.style.display = 'block';
            this.generateButton.disabled = true;
            this.infoSection.style.display = 'none';
        }
    }

    handleClear() {
        this.resetState();
    }

    handleGenerate() {
        if (!this.parsedData) {
            return;
        }

        try {
            const options = {
                animationName: this.animationNameInput.value || 'BlendShapeAnimation',
                meshPath: this.meshPathInput.value || '',
                sampleRate: parseFloat(this.sampleRateInput.value) || 60
            };

            if (this.parsedData.isMultiFrame) {
                // Multi-frame animation
                this.generatedYAML = BlendShapeWeightImporter.convertToAnimation({
                    ...options,
                    frames: this.parsedData.frames,
                    wrapMode: 0
                });
            } else {
                // Static animation
                const duration = parseFloat(this.durationInput.value) || 1.0;
                this.generatedYAML = BlendShapeWeightImporter.createStaticAnimation(
                    this.parsedData.blendShapeData,
                    {
                        ...options,
                        duration
                    }
                );
            }

            this.downloadButton.style.display = 'inline-flex';
            this.updateStatus('Animation generated successfully!', 'success');
        } catch (error) {
            this.errorDisplay.textContent = `Generation error: ${error.message}`;
            this.errorDisplay.style.display = 'block';
            this.updateStatus('Failed to generate animation', 'error');
        }
    }

    handleDownload() {
        if (!this.generatedYAML) {
            return;
        }

        const filename = `${this.animationNameInput.value || 'BlendShapeAnimation'}.anim`;
        FileHandler.downloadFile(this.generatedYAML, filename);
        this.updateStatus(`Downloaded: ${filename}`, 'success');
    }

    showInfo(blendShapeCount, frameCount) {
        this.infoSection.style.display = 'block';
        this.blendShapeCount.textContent = blendShapeCount;
        this.frameCount.textContent = frameCount;

        // Count non-zero blend shapes
        let nonZeroCount = 0;
        if (this.parsedData.isMultiFrame) {
            const valuesLength = this.parsedData.frames[0].values.length;
            for (let i = 0; i < valuesLength; i++) {
                const hasNonZero = this.parsedData.frames.some(frame => frame.values[i] !== 0);
                if (hasNonZero) nonZeroCount++;
            }
        } else {
            nonZeroCount = this.parsedData.blendShapeData.values.filter(v => v !== 0).length;
        }

        this.nonZeroCount.textContent = nonZeroCount;
    }

    updateValidationStatus(message, isValid) {
        this.validationText.textContent = message;
        this.validationStatus.className = `validation-status ${isValid ? 'valid' : 'invalid'}`;
    }

    updateStatus(message, type = 'info') {
        const statusText = document.getElementById('status-text');
        if (statusText) {
            statusText.textContent = message;
        }
    }
}
