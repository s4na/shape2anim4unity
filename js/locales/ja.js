// Japanese translations
export const translations = {
    app: {
        title: 'Unity アニメーションエディター'
    },

    header: {
        toggleTheme: 'ダーク/ライトテーマの切り替え',
        viewOnGitHub: 'GitHubで見る',
        toggleLanguage: '言語を切り替え'
    },

    tabs: {
        textToFile: 'テキストからファイル',
        removeZeros: 'ゼロ値を削除',
        blendShapeImport: 'BlendShape インポート',
        about: '情報'
    },

    textToFile: {
        title: 'テキストからアニメーションファイルへの変換',
        description: 'Unity アニメーションのテキストコンテンツを貼り付けて .anim ファイルとしてダウンロードします',
        editorLabel: 'アニメーションコンテンツ (YAML)',
        noContent: 'コンテンツなし',
        filenameLabel: 'ファイル名:',
        clearButton: 'クリア',
        downloadButton: '.anim をダウンロード'
    },

    removeZeros: {
        title: 'ゼロ値のキーフレームを削除',
        description: 'アニメーションファイルをアップロードし、ゼロまたはゼロに近い値のキーフレームを削除してファイルサイズを最適化します',
        uploadText: '.anim ファイルをここにドラッグ＆ドロップ',
        uploadSubtext: 'または',
        browseButton: 'ファイルを参照',
        changeFileButton: 'ファイルを変更',
        processingOptions: '処理オプション',
        exactZero: '正確なゼロ値を削除 (value === 0)',
        nearZero: 'ゼロに近い値を削除（閾値以内）',
        threshold: '閾値:',
        preserveFirstLast: '最初と最後のキーフレームを保持',
        removeEmptyCurves: '処理後に空のカーブを削除',
        curveTypesHeader: '処理するカーブタイプ',
        floatCurves: 'Float カーブ',
        position: '位置',
        rotation: '回転',
        scale: 'スケール',
        processingResults: '処理結果',
        originalKeyframes: '元のキーフレーム',
        keyframesRemoved: '削除されたキーフレーム',
        remainingKeyframes: '残りのキーフレーム',
        sizeReduction: 'サイズ削減',
        resetButton: 'リセット',
        processButton: 'アニメーションを処理',
        downloadProcessedButton: '処理済みファイルをダウンロード'
    },

    blendShapeImport: {
        title: 'BlendShape ウェイトインポーター',
        description: 'Unity BlendShapeWeights の JSON データを貼り付けてアニメーションファイルに変換します',
        editorLabel: 'BlendShapeWeights JSON',
        noContent: 'コンテンツなし',
        totalBlendShapes: '合計 BlendShape 数:',
        nonZeroValues: '非ゼロ値:',
        frames: 'フレーム:',
        animationOptions: 'アニメーションオプション',
        animationName: 'アニメーション名:',
        meshPath: 'メッシュパス (オプション):',
        sampleRate: 'サンプルレート:',
        multiFrameMode: 'マルチフレームモード（1行に1つのJSON）',
        duration: '長さ (秒):',
        frameRate: 'フレームレート (FPS):',
        clearButton: 'クリア',
        generateButton: 'アニメーションを生成',
        downloadButton: '.anim をダウンロード'
    },

    about: {
        title: 'Unity アニメーションエディターについて',
        whatIsThis: 'このツールは何ですか？',
        whatIsThisContent: 'Unity Animation Editor は、Unity 開発者が Unity アニメーションファイル (.anim) をブラウザで直接編集・操作できる Web ベースのツールです。インストール不要で、すべてブラウザ内でローカルに実行されます。',
        features: '機能',
        textToFileConverterTitle: 'テキストからファイルへの変換:',
        textToFileConverterDesc: 'Unity アニメーションの YAML コンテンツを貼り付けて .anim ファイルとしてダウンロード',
        removeZerosTitle: 'ゼロ値の削除:',
        removeZerosDesc: 'アニメーションファイルをアップロードし、ゼロ値のキーフレームを削除してファイルサイズを最適化',
        blendShapeImportTitle: 'BlendShape インポート:',
        blendShapeImportDesc: 'Unity BlendShapeWeights の JSON データをアニメーションファイルに変換',
        privacyFocusedTitle: 'プライバシー重視:',
        privacyFocusedDesc: 'すべての処理はブラウザ内で行われ、データはサーバーに送信されません',
        openSourceTitle: 'オープンソース:',
        openSourceDesc: 'MIT ライセンスの下で自由に使用および変更可能',
        howToUse: '使い方',
        removeZerosTool: 'ゼロ値削除ツール',
        textToFileStep1: 'Unity アニメーションファイルから YAML コンテンツをコピー',
        textToFileStep2: 'テキストエディターに貼り付け',
        textToFileStep3: 'ツールが自動的にフォーマットを検証',
        textToFileStep4: 'ファイル名を入力（オプション）',
        textToFileStep5: '「.anim をダウンロード」をクリックしてファイルを保存',
        removeZerosStep1: '.anim ファイルをアップロードまたはドラッグ＆ドロップ',
        removeZerosStep2: '処理オプションを設定（閾値、カーブタイプなど）',
        removeZerosStep3: '「アニメーションを処理」をクリック',
        removeZerosStep4: '削除された内容の統計を確認',
        removeZerosStep5: '最適化されたファイルをダウンロード',
        blendShapeStep1: 'Unity から BlendShapeWeights JSON データをコピー',
        blendShapeStep2: 'テキストエディターに貼り付け',
        blendShapeStep3: 'アニメーションオプションを設定（名前、メッシュパス、長さ）',
        blendShapeStep4: '「アニメーションを生成」をクリック',
        blendShapeStep5: '.anim ファイルをダウンロード',
        browserCompatibility: 'ブラウザ互換性',
        browserCompatibilityDesc: 'このツールは最新のブラウザで最適に動作します:',
        openSource: 'オープンソース',
        openSourceContent: 'このプロジェクトはオープンソースで、',
        openSourceContent2: 'で公開されています。貢献を歓迎します！',
        license: 'ライセンス',
        licenseContent: 'MIT ライセンス - 個人および商用プロジェクトで自由に使用できます。'
    },

    status: {
        ready: '準備完了',
        noFileLoaded: 'ファイル未読み込み',
        loading: '読み込み中...',
        processing: '処理中...',
        success: '成功',
        error: 'エラー'
    },

    validation: {
        valid: '有効な Unity アニメーション形式',
        noContent: 'コンテンツなし',
        invalidHeader: '無効な YAML ヘッダー - "%YAML 1.1" で始まる必要があります',
        noAnimationClip: 'AnimationClip 定義が見つかりません',
        invalidFormat: '無効なアニメーション形式',
        parseError: 'パースエラー',
        fileTooLarge: 'ファイルが大きすぎます（最大 10MB）',
        invalidFileType: '無効なファイルタイプ - .anim である必要があります'
    }
};
