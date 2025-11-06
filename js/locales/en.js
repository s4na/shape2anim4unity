// English translations
export const translations = {
    app: {
        title: 'shape2anim'
    },

    header: {
        toggleTheme: 'Toggle dark/light theme',
        viewOnGitHub: 'View on GitHub',
        toggleLanguage: 'Switch language'
    },

    tabs: {
        textToFile: 'Text to File',
        removeZeros: 'Remove Zeros',
        blendShapeImport: 'BlendShape Import',
        about: 'About'
    },

    textToFile: {
        title: 'Text to Animation File Converter',
        description: 'Paste Unity animation text content and download it as a .anim file',
        editorLabel: 'Animation Content (YAML)',
        noContent: 'No content',
        filenameLabel: 'Filename:',
        clearButton: 'Clear',
        downloadButton: 'Download .anim'
    },

    removeZeros: {
        title: 'Remove Zero-Value Keyframes',
        description: 'Upload an animation file and remove keyframes with zero or near-zero values to optimize file size',
        uploadText: 'Drag and drop a .anim file here',
        uploadSubtext: 'or',
        browseButton: 'Browse Files',
        changeFileButton: 'Change File',
        processingOptions: 'Processing Options',
        exactZero: 'Remove exact zero values (value === 0)',
        nearZero: 'Remove near-zero values (within threshold)',
        threshold: 'Threshold:',
        preserveFirstLast: 'Preserve first and last keyframes',
        removeEmptyCurves: 'Remove empty curves after processing',
        curveTypesHeader: 'Curve Types to Process',
        floatCurves: 'Float Curves',
        position: 'Position',
        rotation: 'Rotation',
        scale: 'Scale',
        processingResults: 'Processing Results',
        originalKeyframes: 'Original Keyframes',
        keyframesRemoved: 'Keyframes Removed',
        remainingKeyframes: 'Remaining Keyframes',
        sizeReduction: 'Size Reduction',
        resetButton: 'Reset',
        processButton: 'Process Animation',
        downloadProcessedButton: 'Download Processed File'
    },

    blendShapeImport: {
        title: 'BlendShape Weight Importer',
        description: 'Paste Unity BlendShapeWeights JSON data and convert it to an animation file',
        placeholder: 'Paste BlendShapeWeights JSON here...\n\nExample:\nGenericPropertyJSON:{"name":"m_BlendShapeWeights","type":-1,"arraySize":513,"arrayType":"float",...}',
        noContent: 'No content',
        excludeZeros: 'Exclude zeros',
        totalBlendShapes: 'Total BlendShapes:',
        nonZeroValues: 'Non-zero values:',
        frames: 'Frames:',
        animationOptions: 'Animation Options',
        animationName: 'Animation Name:',
        meshPath: 'Mesh Path (optional):',
        sampleRate: 'Sample Rate:',
        multiFrameMode: 'Multi-frame mode (one JSON per line)',
        duration: 'Duration (seconds):',
        frameRate: 'Frame Rate (FPS):',
        clearButton: 'Clear',
        generateButton: 'Generate Animation',
        downloadButton: 'Download .anim',
        errorPrefix: 'Error: '
    },

    about: {
        title: 'About shape2anim',
        whatIsThis: 'What is this tool?',
        whatIsThisContent: 'shape2anim is a web-based tool to convert shape data to Unity animation files. No installation required, everything runs locally in your browser.',
        features: 'Features',
        textToFileConverterTitle: 'Text to File Converter:',
        textToFileConverterDesc: 'Paste Unity animation YAML content and download it as a .anim file',
        removeZerosTitle: 'Remove Zeros:',
        removeZerosDesc: 'Upload an animation file and remove zero-value keyframes to optimize file size',
        blendShapeImportTitle: 'BlendShape Import:',
        blendShapeImportDesc: 'Convert Unity BlendShapeWeights JSON data to animation files',
        privacyFocusedTitle: 'Privacy-Focused:',
        privacyFocusedDesc: 'All processing happens in your browser - no data is sent to any server',
        openSourceTitle: 'Open Source:',
        openSourceDesc: 'Free to use and modify under MIT License',
        howToUse: 'How to Use',
        removeZerosTool: 'Remove Zeros Tool',
        textToFileStep1: 'Copy the YAML content from your Unity animation file',
        textToFileStep2: 'Paste it into the text editor',
        textToFileStep3: 'The tool will automatically validate the format',
        textToFileStep4: 'Enter a filename (optional)',
        textToFileStep5: 'Click "Download .anim" to save the file',
        removeZerosStep1: 'Upload or drag-drop your .anim file',
        removeZerosStep2: 'Configure processing options (threshold, curve types, etc.)',
        removeZerosStep3: 'Click "Process Animation"',
        removeZerosStep4: 'Review the statistics showing what was removed',
        removeZerosStep5: 'Download the optimized file',
        blendShapeStep1: 'Copy BlendShapeWeights JSON data from Unity',
        blendShapeStep2: 'Paste it into the text editor',
        blendShapeStep3: 'Configure animation options (name, mesh path, duration)',
        blendShapeStep4: 'Click "Generate Animation"',
        blendShapeStep5: 'Download the .anim file',
        browserCompatibility: 'Browser Compatibility',
        browserCompatibilityDesc: 'This tool works best on modern browsers:',
        openSource: 'Open Source',
        openSourceContent: 'This project is open source and available on ',
        openSourceContent2: '. Contributions are welcome!',
        license: 'License',
        licenseContent: 'MIT License - Free to use for personal and commercial projects.'
    },

    status: {
        ready: 'Ready',
        noFileLoaded: 'No file loaded',
        loading: 'Loading...',
        processing: 'Processing...',
        success: 'Success',
        error: 'Error'
    },

    validation: {
        valid: 'Valid Unity animation format',
        noContent: 'No content',
        invalidHeader: 'Invalid YAML header - must start with "%YAML 1.1"',
        noAnimationClip: 'Missing AnimationClip definition',
        invalidFormat: 'Invalid animation format',
        parseError: 'Parse error',
        fileTooLarge: 'File is too large (max 10MB)',
        invalidFileType: 'Invalid file type - must be .anim'
    },

    errors: {
        initFailed: 'Application failed to initialize. Please refresh the page.'
    },

    meta: {
        description: 'Unity BlendShape Weight Importer - Convert BlendShapeWeights JSON to .anim files',
        keywords: 'Unity, BlendShape, Animation, Tool, Web'
    }
};
