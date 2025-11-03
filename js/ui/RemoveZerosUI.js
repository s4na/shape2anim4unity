// Remove Zeros Tool UI Controller
import { FileHandler } from '../utils/FileHandler.js';
import { AnimationParser } from '../parsers/AnimationParser.js';
import { AnimationSerializer } from '../parsers/AnimationSerializer.js';
import { ZeroRemover } from '../processors/ZeroRemover.js';

export class RemoveZerosUI {
    constructor() {
        this.fileInput = null;
        this.fileUploadZone = null;
        this.uploadSection = null;
        this.fileInfo = null;
        this.optionsSection = null;
        this.resultsSection = null;
        this.toolActions = null;

        this.currentFile = null;
        this.currentContent = null;
        this.parsedAnimation = null;
        this.processedContent = null;
        this.processingStats = null;

        this.init();
    }

    init() {
        // Get DOM elements
        this.fileInput = document.getElementById('file-input');
        this.fileUploadZone = document.getElementById('file-upload-zone');
        this.uploadSection = document.getElementById('upload-section');
        this.fileInfo = document.getElementById('file-info');
        this.optionsSection = document.getElementById('options-section');
        this.resultsSection = document.getElementById('results-section');
        this.toolActions = document.getElementById('tool-actions');

        if (!this.fileInput) return;

        // Setup file upload
        this.setupFileUpload();

        // Setup options
        this.setupOptions();

        // Setup action buttons
        this.setupActions();
    }

    setupFileUpload() {
        // Browse button
        const browseButton = document.getElementById('browse-button');
        browseButton?.addEventListener('click', () => {
            this.fileInput.click();
        });

        // File input change
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileSelect(file);
            }
        });

        // Drag and drop
        this.fileUploadZone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.fileUploadZone.classList.add('drag-over');
        });

        this.fileUploadZone?.addEventListener('dragleave', () => {
            this.fileUploadZone.classList.remove('drag-over');
        });

        this.fileUploadZone?.addEventListener('drop', (e) => {
            e.preventDefault();
            this.fileUploadZone.classList.remove('drag-over');

            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileSelect(file);
            }
        });

        // Click to upload
        this.fileUploadZone?.addEventListener('click', () => {
            this.fileInput.click();
        });

        // Change file button
        const changeFileButton = document.getElementById('change-file-button');
        changeFileButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.click();
        });
    }

    setupOptions() {
        // Near zero checkbox toggle
        const nearZeroCheckbox = document.getElementById('near-zero');
        const thresholdControl = document.getElementById('threshold-control');

        nearZeroCheckbox?.addEventListener('change', (e) => {
            if (thresholdControl) {
                thresholdControl.style.display = e.target.checked ? 'flex' : 'none';
            }
        });

        // Threshold slider
        const thresholdSlider = document.getElementById('threshold-slider');
        const thresholdValue = document.getElementById('threshold-value');

        thresholdSlider?.addEventListener('input', (e) => {
            const value = Math.pow(10, parseFloat(e.target.value));
            if (thresholdValue) {
                thresholdValue.textContent = value.toFixed(5);
            }
        });
    }

    setupActions() {
        // Process button
        const processButton = document.getElementById('process-button');
        processButton?.addEventListener('click', () => {
            this.processAnimation();
        });

        // Download button
        const downloadButton = document.getElementById('download-processed-button');
        downloadButton?.addEventListener('click', () => {
            this.downloadProcessedFile();
        });

        // Reset button
        const resetButton = document.getElementById('reset-button');
        resetButton?.addEventListener('click', () => {
            this.reset();
        });
    }

    async handleFileSelect(file) {
        try {
            // Validate file
            const validation = FileHandler.validateFile(file);
            if (!validation.valid) {
                this.showError(validation.error);
                return;
            }

            // Read file
            this.currentContent = await FileHandler.readAsText(file);
            this.currentFile = file;

            // Parse animation
            this.parsedAnimation = AnimationParser.parse(this.currentContent);

            // Update UI
            this.showFileInfo(file);
            this.showOptions();
            this.showActions();
            this.hideResults();

            // Update status
            this.updateStatus(`Loaded: ${file.name}`);

        } catch (error) {
            this.showError(`Failed to load file: ${error.message}`);
        }
    }

    showFileInfo(file) {
        // Hide upload zone, show file info
        if (this.fileUploadZone) {
            this.fileUploadZone.style.display = 'none';
        }
        if (this.fileInfo) {
            this.fileInfo.style.display = 'block';
        }

        // Update file info
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');

        if (fileName) {
            fileName.textContent = file.name;
        }
        if (fileSize) {
            fileSize.textContent = FileHandler.formatFileSize(file.size);
        }
    }

    showOptions() {
        if (this.optionsSection) {
            this.optionsSection.style.display = 'block';
        }
    }

    showActions() {
        if (this.toolActions) {
            this.toolActions.style.display = 'flex';
        }

        // Show process button, hide download button
        const processButton = document.getElementById('process-button');
        const downloadButton = document.getElementById('download-processed-button');

        if (processButton) {
            processButton.style.display = 'inline-flex';
        }
        if (downloadButton) {
            downloadButton.style.display = 'none';
        }
    }

    hideResults() {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'none';
        }
    }

    getOptions() {
        return {
            exactZero: document.getElementById('exact-zero')?.checked ?? true,
            nearZero: document.getElementById('near-zero')?.checked ?? false,
            threshold: Math.pow(10, parseFloat(document.getElementById('threshold-slider')?.value ?? -4)),
            preserveFirstLast: document.getElementById('preserve-first-last')?.checked ?? true,
            removeEmptyCurves: document.getElementById('remove-empty-curves')?.checked ?? true,
            processFloat: document.getElementById('process-float')?.checked ?? true,
            processPosition: document.getElementById('process-position')?.checked ?? true,
            processRotation: document.getElementById('process-rotation')?.checked ?? true,
            processScale: document.getElementById('process-scale')?.checked ?? true
        };
    }

    processAnimation() {
        try {
            this.updateStatus('Processing...');

            const options = this.getOptions();

            // Process with ZeroRemover
            const result = ZeroRemover.process(this.parsedAnimation, options);

            // Serialize back to YAML
            this.processedContent = AnimationSerializer.rebuildWithCurves(
                this.currentContent,
                result.modifiedCurves
            );

            // Store stats
            this.processingStats = result.stats;

            // Calculate size reduction
            const sizeReduction = ZeroRemover.calculateSizeReduction(
                this.currentContent,
                this.processedContent
            );

            // Update UI
            this.showResults(result.stats, sizeReduction);
            this.updateStatus('Processing complete');

            // Show download button
            const processButton = document.getElementById('process-button');
            const downloadButton = document.getElementById('download-processed-button');

            if (processButton) {
                processButton.style.display = 'none';
            }
            if (downloadButton) {
                downloadButton.style.display = 'inline-flex';
            }

        } catch (error) {
            this.showError(`Processing failed: ${error.message}`);
            this.updateStatus('Processing failed');
        }
    }

    showResults(stats, sizeReduction) {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'block';
        }

        // Update statistics
        document.getElementById('stat-original-keyframes').textContent = stats.originalKeyframes;
        document.getElementById('stat-removed-keyframes').textContent = stats.removedKeyframes;
        document.getElementById('stat-remaining-keyframes').textContent = stats.remainingKeyframes;
        document.getElementById('stat-size-reduction').textContent = `${sizeReduction}%`;

        // Update status message
        const processingStatus = document.getElementById('processing-status');
        if (processingStatus) {
            const summary = ZeroRemover.generateSummary(stats);
            processingStatus.textContent = summary;
            processingStatus.classList.add('success');
        }
    }

    downloadProcessedFile() {
        if (!this.processedContent) {
            this.showError('No processed content to download');
            return;
        }

        const originalName = this.currentFile?.name || 'animation.anim';
        const newName = originalName.replace('.anim', '_processed.anim');

        const success = FileHandler.downloadAsFile(this.processedContent, newName);

        if (success) {
            this.updateStatus(`Downloaded: ${newName}`);
        } else {
            this.showError('Download failed');
        }
    }

    reset() {
        // Reset state
        this.currentFile = null;
        this.currentContent = null;
        this.parsedAnimation = null;
        this.processedContent = null;
        this.processingStats = null;

        // Reset file input
        if (this.fileInput) {
            this.fileInput.value = '';
        }

        // Show upload zone, hide file info
        if (this.fileUploadZone) {
            this.fileUploadZone.style.display = 'flex';
        }
        if (this.fileInfo) {
            this.fileInfo.style.display = 'none';
        }

        // Hide options, results, actions
        if (this.optionsSection) {
            this.optionsSection.style.display = 'none';
        }
        if (this.resultsSection) {
            this.resultsSection.style.display = 'none';
        }
        if (this.toolActions) {
            this.toolActions.style.display = 'none';
        }

        this.updateStatus('Ready');
    }

    showError(message) {
        alert(message); // Simple error display for now
        console.error(message);
    }

    updateStatus(message) {
        const statusText = document.getElementById('status-text');
        if (statusText) {
            statusText.textContent = message;
        }
    }
}
