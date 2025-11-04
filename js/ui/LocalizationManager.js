// Localization Management
import { CONFIG } from '../config.js';

export class LocalizationManager {
    constructor() {
        this.currentLanguage = this.loadLanguage();
        this.translations = {};
        this.listeners = [];
    }

    async init() {
        // Load translation files
        await this.loadTranslations();

        // Apply saved language
        this.applyLanguage(this.currentLanguage);

        // Setup language toggle button
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }

    async loadTranslations() {
        try {
            // Import translation modules
            const enModule = await import('../locales/en.js');
            const jaModule = await import('../locales/ja.js');

            this.translations = {
                en: enModule.translations,
                ja: jaModule.translations
            };
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    loadLanguage() {
        const saved = localStorage.getItem(CONFIG.LANGUAGE_KEY);
        return saved || CONFIG.DEFAULT_LANGUAGE;
    }

    saveLanguage(language) {
        localStorage.setItem(CONFIG.LANGUAGE_KEY, language);
    }

    applyLanguage(language) {
        this.currentLanguage = language;
        this.saveLanguage(language);

        // Update document language attribute
        document.documentElement.setAttribute('lang', language);

        // Update all text content
        this.updateContent();

        // Notify listeners
        this.notifyListeners();
    }

    updateContent() {
        const t = this.translations[this.currentLanguage];
        if (!t) return;

        // Update document title
        document.title = t.app.title;

        // Update header
        const headerTitle = document.querySelector('.app-header h1');
        if (headerTitle) headerTitle.textContent = t.app.title;

        // Update theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', t.header.toggleTheme);
            themeToggle.setAttribute('title', t.header.toggleTheme);
        }

        // Update GitHub link
        const githubLink = document.querySelector('.app-header a[href*="github"]');
        if (githubLink) {
            githubLink.setAttribute('aria-label', t.header.viewOnGitHub);
            githubLink.setAttribute('title', t.header.viewOnGitHub);
        }

        // Update language toggle
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.setAttribute('aria-label', t.header.toggleLanguage);
            languageToggle.setAttribute('title', t.header.toggleLanguage);
            languageToggle.textContent = this.currentLanguage === 'en' ? 'EN' : 'JP';
        }

        // Update tab buttons
        this.updateTabButtons(t);

        // Update Text to File tab
        this.updateTextToFileTab(t);

        // Update Remove Zeros tab
        this.updateRemoveZerosTab(t);

        // Update BlendShape Import tab
        this.updateBlendShapeTab(t);

        // Update About tab
        this.updateAboutTab(t);

        // Update status bar
        const statusText = document.getElementById('status-text');
        if (statusText && statusText.textContent === 'Ready') {
            statusText.textContent = t.status.ready;
        }

        const fileStatus = document.getElementById('file-status');
        if (fileStatus && fileStatus.textContent === 'No file loaded') {
            fileStatus.textContent = t.status.noFileLoaded;
        }
    }

    updateTabButtons(t) {
        const tabs = [
            { selector: '[data-tab="text-to-file"]', text: t.tabs.textToFile },
            { selector: '[data-tab="remove-zeros"]', text: t.tabs.removeZeros },
            { selector: '[data-tab="blendshape-import"]', text: t.tabs.blendShapeImport },
            { selector: '[data-tab="about"]', text: t.tabs.about }
        ];

        tabs.forEach(({ selector, text }) => {
            const button = document.querySelector(`.tab-button${selector}`);
            if (button) {
                // Remove all existing text nodes
                Array.from(button.childNodes).forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.remove();
                    }
                });
                // Add new text node with proper spacing
                button.appendChild(document.createTextNode(' ' + text));
            }
        });
    }

    updateTextToFileTab(t) {
        const tab = t.textToFile;

        // Update tab header
        const header = document.querySelector('#text-to-file .tab-header h2');
        if (header) header.textContent = tab.title;

        const description = document.querySelector('#text-to-file .tab-header p');
        if (description) description.textContent = tab.description;

        // Update editor labels
        const editorLabel = document.querySelector('#text-to-file label[for="animation-text"]');
        if (editorLabel) editorLabel.textContent = tab.editorLabel;

        const statusText = document.querySelector('#validation-status .status-text');
        if (statusText && statusText.textContent === 'No content') {
            statusText.textContent = tab.noContent;
        }

        // Update filename label
        const filenameLabel = document.querySelector('#text-to-file label[for="filename-input"]');
        if (filenameLabel) filenameLabel.textContent = tab.filenameLabel;

        // Update buttons
        const clearButton = document.getElementById('clear-button');
        if (clearButton) {
            const textNode = Array.from(clearButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = tab.clearButton;
        }

        const downloadButton = document.getElementById('download-button');
        if (downloadButton) {
            const textNode = Array.from(downloadButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = tab.downloadButton;
        }
    }

    updateRemoveZerosTab(t) {
        const tab = t.removeZeros;

        // Update tab header
        const header = document.querySelector('#remove-zeros .tab-header h2');
        if (header) header.textContent = tab.title;

        const description = document.querySelector('#remove-zeros .tab-header p');
        if (description) description.textContent = tab.description;

        // Update upload section
        const uploadText = document.querySelector('.upload-text');
        if (uploadText) uploadText.textContent = tab.uploadText;

        const uploadSubtext = document.querySelector('.upload-subtext');
        if (uploadSubtext) uploadSubtext.textContent = tab.uploadSubtext;

        const browseButton = document.getElementById('browse-button');
        if (browseButton) browseButton.textContent = tab.browseButton;

        const changeFileButton = document.getElementById('change-file-button');
        if (changeFileButton) changeFileButton.textContent = tab.changeFileButton;

        // Update options section
        const optionsHeader = document.querySelector('#remove-zeros .options-section h3');
        if (optionsHeader) optionsHeader.textContent = tab.processingOptions;

        // Update checkbox labels
        this.updateCheckboxLabel('exact-zero', tab.exactZero);
        this.updateCheckboxLabel('near-zero', tab.nearZero);
        this.updateCheckboxLabel('preserve-first-last', tab.preserveFirstLast);
        this.updateCheckboxLabel('remove-empty-curves', tab.removeEmptyCurves);

        const thresholdLabel = document.querySelector('#threshold-control label[for="threshold-slider"]');
        if (thresholdLabel) thresholdLabel.textContent = tab.threshold;

        // Update curve types header
        const curveTypesHeader = document.querySelector('#remove-zeros .options-section h4');
        if (curveTypesHeader) curveTypesHeader.textContent = tab.curveTypesHeader;

        this.updateCheckboxLabel('process-float', tab.floatCurves);
        this.updateCheckboxLabel('process-position', tab.position);
        this.updateCheckboxLabel('process-rotation', tab.rotation);
        this.updateCheckboxLabel('process-scale', tab.scale);

        // Update results section
        const resultsHeader = document.querySelector('#remove-zeros .results-section h3');
        if (resultsHeader) resultsHeader.textContent = tab.processingResults;

        const statLabels = [
            { id: 'stat-original-keyframes', label: tab.originalKeyframes },
            { id: 'stat-removed-keyframes', label: tab.keyframesRemoved },
            { id: 'stat-remaining-keyframes', label: tab.remainingKeyframes },
            { id: 'stat-size-reduction', label: tab.sizeReduction }
        ];

        statLabels.forEach(({ id, label }) => {
            const statCard = document.getElementById(id)?.closest('.stat-card');
            if (statCard) {
                const labelElement = statCard.querySelector('.stat-label');
                if (labelElement) labelElement.textContent = label;
            }
        });

        // Update buttons
        const resetButton = document.getElementById('reset-button');
        if (resetButton) resetButton.textContent = tab.resetButton;

        const processButton = document.getElementById('process-button');
        if (processButton) processButton.textContent = tab.processButton;

        const downloadProcessedButton = document.getElementById('download-processed-button');
        if (downloadProcessedButton) {
            const textNode = Array.from(downloadProcessedButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = tab.downloadProcessedButton;
        }
    }

    updateBlendShapeTab(t) {
        const tab = t.blendShapeImport;

        // Update tab header
        const header = document.querySelector('#blendshape-import .tab-header h2');
        if (header) header.textContent = tab.title;

        const description = document.querySelector('#blendshape-import .tab-header p');
        if (description) description.textContent = tab.description;

        // Update editor labels
        const editorLabel = document.querySelector('#blendshape-import label[for="blendshape-json-input"]');
        if (editorLabel) editorLabel.textContent = tab.editorLabel;

        const statusText = document.getElementById('blendshape-validation-text');
        if (statusText && statusText.textContent === 'No content') {
            statusText.textContent = tab.noContent;
        }

        // Update info labels
        const infoLabels = document.querySelectorAll('#blendshape-info-section .info-label');
        if (infoLabels[0]) infoLabels[0].textContent = tab.totalBlendShapes;
        if (infoLabels[1]) infoLabels[1].textContent = tab.nonZeroValues;
        if (infoLabels[2]) infoLabels[2].textContent = tab.frames;

        // Update options section
        const optionsHeader = document.querySelector('#blendshape-import .options-section h3');
        if (optionsHeader) optionsHeader.textContent = tab.animationOptions;

        const animationNameLabel = document.querySelector('label[for="blendshape-animation-name"]');
        if (animationNameLabel) animationNameLabel.textContent = tab.animationName;

        const meshPathLabel = document.querySelector('label[for="blendshape-mesh-path"]');
        if (meshPathLabel) meshPathLabel.textContent = tab.meshPath;

        const sampleRateLabel = document.querySelector('label[for="blendshape-sample-rate"]');
        if (sampleRateLabel) sampleRateLabel.textContent = tab.sampleRate;

        this.updateCheckboxLabel('blendshape-multi-frame', tab.multiFrameMode);

        const durationLabel = document.querySelector('label[for="blendshape-duration"]');
        if (durationLabel) durationLabel.textContent = tab.duration;

        const frameRateLabel = document.querySelector('label[for="blendshape-frame-rate"]');
        if (frameRateLabel) frameRateLabel.textContent = tab.frameRate;

        // Update buttons
        const clearButton = document.getElementById('blendshape-clear-button');
        if (clearButton) {
            const textNode = Array.from(clearButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = tab.clearButton;
        }

        const generateButton = document.getElementById('blendshape-generate-button');
        if (generateButton) {
            const textNode = Array.from(generateButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = tab.generateButton;
        }

        const downloadButton = document.getElementById('blendshape-download-button');
        if (downloadButton) {
            const textNode = Array.from(downloadButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = tab.downloadButton;
        }
    }

    updateAboutTab(t) {
        const tab = t.about;

        // Update tab header
        const header = document.querySelector('#about .tab-header h2');
        if (header) header.textContent = tab.title;

        // Update sections
        const sections = document.querySelectorAll('#about .about-section');

        if (sections[0]) {
            sections[0].querySelector('h3').textContent = tab.whatIsThis;
            sections[0].querySelector('p').textContent = tab.whatIsThisContent;
        }

        if (sections[1]) {
            sections[1].querySelector('h3').textContent = tab.features;
            const listItems = sections[1].querySelectorAll('li');
            if (listItems[0]) listItems[0].innerHTML = `<strong>${tab.textToFileConverterTitle}</strong> ${tab.textToFileConverterDesc}`;
            if (listItems[1]) listItems[1].innerHTML = `<strong>${tab.removeZerosTitle}</strong> ${tab.removeZerosDesc}`;
            if (listItems[2]) listItems[2].innerHTML = `<strong>${tab.blendShapeImportTitle}</strong> ${tab.blendShapeImportDesc}`;
            if (listItems[3]) listItems[3].innerHTML = `<strong>${tab.privacyFocusedTitle}</strong> ${tab.privacyFocusedDesc}`;
            if (listItems[4]) listItems[4].innerHTML = `<strong>${tab.openSourceTitle}</strong> ${tab.openSourceDesc}`;
        }

        if (sections[2]) {
            sections[2].querySelector('h3').textContent = tab.howToUse;
            const h4Elements = sections[2].querySelectorAll('h4');
            if (h4Elements[0]) h4Elements[0].textContent = tab.textToFileConverterTitle;
            if (h4Elements[1]) h4Elements[1].textContent = tab.removeZerosTool;
            if (h4Elements[2]) h4Elements[2].textContent = tab.blendShapeImportTitle;

            const olElements = sections[2].querySelectorAll('ol');
            if (olElements[0]) {
                const items = olElements[0].querySelectorAll('li');
                items[0].textContent = tab.textToFileStep1;
                items[1].textContent = tab.textToFileStep2;
                items[2].textContent = tab.textToFileStep3;
                items[3].textContent = tab.textToFileStep4;
                items[4].textContent = tab.textToFileStep5;
            }
            if (olElements[1]) {
                const items = olElements[1].querySelectorAll('li');
                items[0].textContent = tab.removeZerosStep1;
                items[1].textContent = tab.removeZerosStep2;
                items[2].textContent = tab.removeZerosStep3;
                items[3].textContent = tab.removeZerosStep4;
                items[4].textContent = tab.removeZerosStep5;
            }
            if (olElements[2]) {
                const items = olElements[2].querySelectorAll('li');
                items[0].textContent = tab.blendShapeStep1;
                items[1].textContent = tab.blendShapeStep2;
                items[2].textContent = tab.blendShapeStep3;
                items[3].textContent = tab.blendShapeStep4;
                items[4].textContent = tab.blendShapeStep5;
            }
        }

        if (sections[3]) {
            sections[3].querySelector('h3').textContent = tab.browserCompatibility;
            sections[3].querySelector('p').textContent = tab.browserCompatibilityDesc;
        }

        if (sections[4]) {
            sections[4].querySelector('h3').textContent = tab.openSource;
            const p = sections[4].querySelector('p');
            const link = p.querySelector('a');
            p.childNodes[0].textContent = tab.openSourceContent;
            if (link) link.textContent = 'GitHub';
            p.childNodes[2].textContent = tab.openSourceContent2;
        }

        if (sections[5]) {
            sections[5].querySelector('h3').textContent = tab.license;
            sections[5].querySelector('p').textContent = tab.licenseContent;
        }
    }

    updateCheckboxLabel(checkboxId, text) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            const label = checkbox.closest('.checkbox-label');
            if (label) {
                const span = label.querySelector('span');
                if (span) span.textContent = text;
            }
        }
    }

    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'ja' : 'en';
        this.applyLanguage(newLanguage);
    }

    getLanguage() {
        return this.currentLanguage;
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key;
            }
        }

        return value || key;
    }

    onLanguageChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentLanguage));
    }
}
