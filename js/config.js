// Application Configuration
export const CONFIG = {
    // Application Info
    APP_NAME: 'Unity Animation Editor',
    VERSION: '1.0.0',

    // File Handling
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
    ALLOWED_EXTENSIONS: ['.anim'],
    DEFAULT_FILENAME: 'animation.anim',

    // Validation
    VALIDATION_DEBOUNCE: 300, // ms

    // Zero Removal Defaults
    DEFAULT_THRESHOLD: 0.0001,
    MIN_THRESHOLD: 0.00001,
    MAX_THRESHOLD: 0.01,

    // Unity Animation Format
    YAML_HEADER: '%YAML 1.1',
    UNITY_TAG: '%TAG !u! tag:unity3d.com,2011:',
    ANIMATION_CLIP_TAG: 'AnimationClip:',

    // Curve Types
    CURVE_TYPES: {
        FLOAT: 'm_FloatCurves',
        POSITION: 'm_PositionCurves',
        ROTATION: 'm_RotationCurves',
        EULER: 'm_EulerCurves',
        SCALE: 'm_ScaleCurves',
        COMPRESSED_ROTATION: 'm_CompressedRotationCurves'
    },

    // Theme
    THEME_KEY: 'unity-anim-editor-theme',
    DEFAULT_THEME: 'light',

    // Status Messages
    STATUS: {
        READY: 'Ready',
        LOADING: 'Loading...',
        PROCESSING: 'Processing...',
        SUCCESS: 'Success',
        ERROR: 'Error'
    },

    // Validation Messages
    VALIDATION_MESSAGES: {
        VALID: 'Valid Unity animation format',
        NO_CONTENT: 'No content',
        INVALID_HEADER: 'Invalid YAML header - must start with "%YAML 1.1"',
        NO_ANIMATION_CLIP: 'Missing AnimationClip definition',
        INVALID_FORMAT: 'Invalid animation format',
        PARSE_ERROR: 'Parse error',
        FILE_TOO_LARGE: 'File is too large (max 10MB)',
        INVALID_FILE_TYPE: 'Invalid file type - must be .anim'
    }
};
