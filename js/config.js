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
        READY: '準備完了',
        LOADING: '読み込み中...',
        PROCESSING: '処理中...',
        SUCCESS: '成功',
        ERROR: 'エラー'
    },

    // Validation Messages
    VALIDATION_MESSAGES: {
        VALID: '有効なUnityアニメーション形式',
        NO_CONTENT: '内容なし',
        INVALID_HEADER: '無効なYAMLヘッダー - "%YAML 1.1"で始まる必要があります',
        NO_ANIMATION_CLIP: 'AnimationClip定義が見つかりません',
        INVALID_FORMAT: '無効なアニメーション形式',
        PARSE_ERROR: '解析エラー',
        FILE_TOO_LARGE: 'ファイルが大きすぎます（最大10MB）',
        INVALID_FILE_TYPE: '無効なファイルタイプ - .animである必要があります'
    }
};
