# CLAUDE.md - AI開発者向けリファレンス

このドキュメントは、Claude AIがこのプロジェクトを開発・保守する際の参考資料です。

## プロジェクト概要

**Unity Animation Editor** は、Unity開発者向けのWebベースツールで、.animファイルをブラウザ上で直接編集できます。

### 主な機能
1. **Text to File**: YAMLテキストから.animファイルを生成
2. **Remove Zeros**: ゼロ値キーフレームを削除してファイルサイズを最適化
3. **Blend Shape Weight Importer**: VRMファイルからブレンドシェイプウェイトをインポート

### 技術スタック
- **Vanilla JavaScript (ES6+)**: フレームワークなし、モジュラーアーキテクチャ
- **HTML5 + CSS3**: セマンティックマークアップ、モダンなスタイリング
- **File API / Blob API**: ファイル操作
- **Jest**: ユニットテスト

## アーキテクチャ

### ディレクトリ構造
```
unity-animation-editor/
├── index.html              # メインHTMLファイル
├── css/                    # スタイルシート
│   ├── main.css           # 基本スタイル
│   ├── layout.css         # レイアウト
│   ├── components.css     # UIコンポーネント
│   └── themes.css         # ダーク/ライトテーマ
├── js/                     # JavaScriptモジュール
│   ├── main.js            # エントリーポイント
│   ├── config.js          # 設定定数
│   ├── parsers/           # パーサー
│   │   ├── AnimationParser.js
│   │   └── AnimationSerializer.js
│   ├── processors/        # データ処理
│   │   ├── ZeroRemover.js
│   │   └── BlendShapeWeightImporter.js
│   ├── ui/                # UIコンポーネント
│   │   ├── TabManager.js
│   │   ├── ThemeManager.js
│   │   ├── TextToFileUI.js
│   │   ├── RemoveZerosUI.js
│   │   ├── BlendShapeUI.js
│   │   └── LocalizationManager.js
│   ├── utils/             # ユーティリティ
│   │   └── FileHandler.js
│   └── locales/           # 多言語対応
│       ├── en.js
│       └── ja.js
├── __tests__/             # Jestテスト
└── assets/                # 静的アセット
    └── examples/          # サンプルファイル
```

### コアモジュールの役割

#### パーサー (parsers/)
- **AnimationParser.js**: Unity .animファイル（YAML形式）をパースしてJavaScriptオブジェクトに変換
- **AnimationSerializer.js**: JavaScriptオブジェクトをUnity .animファイル形式（YAML）にシリアライズ

#### プロセッサー (processors/)
- **ZeroRemover.js**: アニメーションカーブからゼロ値キーフレームを削除
- **BlendShapeWeightImporter.js**: VRMファイルからブレンドシェイプウェイトを抽出してアニメーションに追加

#### UI (ui/)
- **TabManager.js**: タブナビゲーション管理
- **ThemeManager.js**: ダーク/ライトテーマの切り替え
- **LocalizationManager.js**: 多言語対応（日本語/英語）
- **TextToFileUI.js**: テキストからファイルへの変換UI
- **RemoveZerosUI.js**: ゼロ値削除ツールUI
- **BlendShapeUI.js**: ブレンドシェイプインポートUI

#### ユーティリティ (utils/)
- **FileHandler.js**: ファイルのアップロード/ダウンロード処理

## Unityアニメーションフォーマット

### 基本構造
```yaml
%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!74 &7400000
AnimationClip:
  m_Name: AnimationName
  m_FloatCurves:
  - curve:
      m_Curve:
      - time: 0
        value: 1.0
        inSlope: 0
        outSlope: 0
        tangentMode: 136
    attribute: blendShape.face
    path: Body
    classID: 137
```

### 重要なフィールド
- **m_FloatCurves**: Float型のアニメーションカーブ（ブレンドシェイプなど）
- **m_PositionCurves**: 位置のアニメーションカーブ
- **m_RotationCurves**: 回転のアニメーションカーブ
- **m_ScaleCurves**: スケールのアニメーションカーブ
- **curve.m_Curve**: キーフレームの配列
- **attribute**: アニメーション対象のプロパティ
- **path**: GameObjectのパス
- **classID**: Unityコンポーネントタイプ（137 = SkinnedMeshRenderer）

## コーディング規約

### JavaScript
1. **ES6+構文を使用**: const/let、アロー関数、クラス構文など
2. **モジュールパターン**: 各ファイルは単一の責務を持つクラスやユーティリティ
3. **命名規則**:
   - クラス: PascalCase (`AnimationParser`)
   - 関数/変数: camelCase (`parseAnimation`)
   - 定数: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
   - プライベートメソッド: アンダースコアプレフィックス (`_parseHeader`)
4. **エラーハンドリング**: try-catchブロックで適切にエラーを処理
5. **コメント**: 複雑なロジックには必ずコメントを記述

### CSS
1. **BEM記法**: Block-Element-Modifier (`tab__button--active`)
2. **CSS変数**: テーマカラーは`themes.css`で定義
3. **レスポンシブ**: モバイルファーストのデザイン

### HTML
1. **セマンティックタグ**: `<section>`, `<article>`, `<nav>`などを適切に使用
2. **アクセシビリティ**: `aria-*`属性、適切なラベル
3. **data属性**: 動的な要素には`data-*`属性を使用

## 開発ガイドライン

### 新機能の追加手順

1. **計画**: `plan.md`に機能仕様を追加
2. **UIコンポーネント**: `js/ui/`に新しいUIクラスを作成
3. **プロセッサー**: 必要に応じて`js/processors/`に処理ロジックを追加
4. **多言語対応**: `js/locales/en.js`と`js/locales/ja.js`に翻訳を追加
5. **テスト**: `__tests__/`にユニットテストを作成
6. **ドキュメント**: `README.md`を更新

### 既存機能の修正

1. **問題の特定**: エラーメッセージ、ユーザーレポートから原因を調査
2. **テストの追加**: バグを再現するテストを先に作成
3. **修正の実装**: 最小限の変更で問題を解決
4. **回帰テスト**: 既存のテストがすべてパスすることを確認
5. **手動テスト**: 複数のブラウザで動作確認

### テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジレポート
npm run test:coverage
```

## よくある開発タスク

### 1. 新しいタブの追加

```javascript
// 1. index.htmlにタブボタンとコンテンツを追加
<button class="tab__button" data-tab="new-feature">New Feature</button>
<section class="tab__content" data-tab="new-feature">...</section>

// 2. js/ui/NewFeatureUI.jsを作成
export class NewFeatureUI {
  constructor() {
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // イベントリスナーの設定
  }
}

// 3. js/main.jsで初期化
import { NewFeatureUI } from './ui/NewFeatureUI.js';
const newFeatureUI = new NewFeatureUI();

// 4. 多言語対応を追加
// js/locales/ja.js と en.js に翻訳を追加
```

### 2. アニメーションパーサーの拡張

```javascript
// js/parsers/AnimationParser.jsを修正
class AnimationParser {
  parse(yamlContent) {
    // 新しいカーブタイプの処理を追加
    this._parseNewCurveType(data);
  }

  _parseNewCurveType(data) {
    // 実装
  }
}
```

### 3. 新しいプロセッサーの追加

```javascript
// js/processors/NewProcessor.jsを作成
export class NewProcessor {
  constructor(options = {}) {
    this.options = options;
  }

  process(animationData) {
    // 処理ロジック
    return processedData;
  }
}
```

## デバッグとトラブルシューティング

### ローカルサーバーの起動

```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

**重要**: `file://`プロトコルでは動作しません。必ずHTTPサーバーを使用してください。

### よくある問題

#### 1. パースエラー
- **原因**: YAMLフォーマットが不正、またはUnityバージョンの違い
- **デバッグ**: `AnimationParser.js`の`parse()`メソッドにconsole.logを追加
- **解決**: 正規表現パターンを調整、エラーハンドリングを強化

#### 2. ファイルダウンロードが失敗
- **原因**: Blob APIの使用方法が不適切
- **デバッグ**: `FileHandler.js`の`downloadFile()`メソッドを確認
- **解決**: ブラウザの互換性を確認、Blob生成ロジックを見直す

#### 3. UIが更新されない
- **原因**: イベントリスナーが正しく登録されていない
- **デバッグ**: ブラウザの開発者ツールでDOM要素とイベントを確認
- **解決**: `DOMContentLoaded`後に初期化、要素のセレクターを確認

#### 4. テストが失敗
- **原因**: Node.jsバージョン、モックの設定不足
- **デバッグ**: `npm test -- --verbose`で詳細を確認
- **解決**: `jest.config.js`を確認、モックを適切に設定

### ブラウザ互換性の確認

テストすべきブラウザ:
- Chrome 90+
- Firefox 88+
- Safari 14+

確認すべき機能:
- ファイルのアップロード/ダウンロード
- ドラッグ&ドロップ
- テーマの切り替え
- タブの切り替え
- 各機能の処理

## セキュリティとプライバシー

### 重要な原則
1. **すべての処理はクライアントサイド**: サーバーへのデータ送信なし
2. **外部通信なし**: アナリティクスやトラッキングは一切含めない
3. **ファイルサイズ制限**: 大きなファイルでブラウザがクラッシュしないよう制限（10MB）

### 実装の注意点
- `eval()`は使用しない
- ユーザー入力は必ずサニタイズ
- XSS対策: DOMへの挿入は`textContent`を使用（`innerHTML`は避ける）

## パフォーマンス最適化

### ベストプラクティス
1. **大きなファイルの処理**: Web Workerの使用を検討（現在は未実装）
2. **DOM操作**: 一括更新、仮想DOMの使用は避ける（オーバーヘッドのため）
3. **メモリ管理**: 大きなデータ構造は処理後にクリア

### ファイルサイズ制限
- **最大ファイルサイズ**: 10MB（`config.js`で設定）
- **推奨サイズ**: 1MB以下

## Git開発フロー

### ブランチ命名規則
- 機能追加: `feature/feature-name`
- バグ修正: `fix/bug-description`
- Claude開発: `claude/task-description-session-id`

### コミットメッセージ
```
動詞 + 対象 + 詳細

例:
Add blend shape weight import feature
Fix zero removal logic for edge cases
Update README with new feature documentation
Refactor AnimationParser for better performance
```

### プルリクエスト
1. 変更内容の明確な説明
2. テスト結果の記載
3. スクリーンショット（UI変更の場合）
4. 関連するIssueへのリンク

## 今後の拡張予定

### 実装予定の機能（plan.mdより）
1. アニメーションカーブビジュアライザー
2. キーフレームエディタ
3. アニメーションマージャー
4. サンプルレート変換
5. バッチ処理
6. アニメーション検証とレポート

### 技術的改善
1. Web Workerによる並列処理
2. Service Workerによるオフライン対応
3. IndexedDBによるローカルストレージ
4. TypeScriptへの移行（検討中）

## リファレンス

### ドキュメント
- [README.md](README.md): ユーザー向けドキュメント
- [plan.md](plan.md): プロジェクト計画と仕様
- [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md): テストチェックリスト
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md): 実装の概要
- [QUICK_START.md](QUICK_START.md): クイックスタートガイド

### 外部リソース
- [Unity Animation File Format](https://docs.unity3d.com/Manual/class-AnimationClip.html)
- [VRM Specification](https://github.com/vrm-c/vrm-specification)
- [File API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## 注意事項

### やるべきこと
- 変更前に必ずテストを実行
- 複数のブラウザで動作確認
- コードレビューを依頼（可能であれば）
- ドキュメントを更新

### やってはいけないこと
- フレームワークやライブラリを安易に追加しない（バニラJSを維持）
- サーバーサイドの処理を追加しない（クライアントサイドのみ）
- 外部APIへの通信を追加しない（プライバシー重視）
- テストなしで大きな変更をコミットしない

## クイックリファレンス

### よく使うコマンド
```bash
# ローカルサーバー起動
python -m http.server 8000

# テスト実行
npm test

# テストウォッチ
npm run test:watch

# カバレッジ
npm run test:coverage

# Gitステータス確認
git status

# ブランチ作成
git checkout -b feature/new-feature

# コミット
git add .
git commit -m "Add new feature"

# プッシュ
git push -u origin feature/new-feature
```

### よく使うファイルパス
- メインHTML: `index.html`
- エントリーポイント: `js/main.js`
- 設定: `js/config.js`
- 多言語: `js/locales/ja.js`, `js/locales/en.js`
- テスト: `__tests__/*.test.js`

---

**このドキュメントは定期的に更新してください。プロジェクトの進化に合わせて内容を追加・修正してください。**
