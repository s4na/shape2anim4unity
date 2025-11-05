# Unity Animation Editor

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://s4na.github.io/unity-animation-editor/)
[![Tests](https://github.com/s4na/unity-animation-editor/workflows/Tests/badge.svg)](https://github.com/s4na/unity-animation-editor/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Unity開発者向けのWebベースツールで、Unityアニメーションファイル（.anim）をブラウザ上で直接編集・操作できます。インストール不要 - すべての処理がブラウザ上でローカルに実行されます。

**🚀 [ライブデモを試す](https://s4na.github.io/unity-animation-editor/)**

## 機能

### 1. テキストからファイルへの変換
- UnityアニメーションのYAMLコンテンツを貼り付け
- リアルタイムの構文検証
- .animファイルとしてダウンロード
- アニメーション名からファイル名を自動抽出

### 2. ゼロ値削除ツール
- .animファイルのアップロード
- ゼロ値のキーフレームを削除してファイルサイズを最適化
- 設定可能なオプション：
  - 完全なゼロの削除（value === 0）
  - 調整可能な閾値によるほぼゼロの削除
  - 最初/最後のキーフレームを保持
  - 空のカーブを削除
  - 処理する特定のカーブタイプを選択
- 統計情報とサイズ削減率を表示
- 最適化されたファイルをダウンロード

### 3. その他の機能
- ダーク/ライトテーマの切り替え
- ドラッグ&ドロップによるファイルアップロード
- プライバシー重視（すべての処理がローカルで実行）
- モバイル対応デザイン

## 前提条件

### オンライン使用の場合
- モダンなWebブラウザ（Chrome 90+、Firefox 88+、Safari 14+）
- JavaScriptの有効化
- インターネット接続（初回アクセス時のみ）

### ローカル開発の場合
- **Node.js:** v16.x以上（テストの実行に必要）
- **npm:** v7.x以上
- **Git:** バージョン管理用（オプション）
- モダンなWebブラウザ

## はじめに

### オプション1: オンラインで使用
GitHub Pagesにアクセス: [https://s4na.github.io/unity-animation-editor/](https://s4na.github.io/unity-animation-editor/)

### オプション2: ローカルで実行
1. このリポジトリをクローン:
   ```bash
   git clone https://github.com/s4na/unity-animation-editor.git
   cd unity-animation-editor
   ```

2. ローカルWebサーバーでファイルを配信。以下のいずれかの方法を使用できます：

   **Python 3を使用:**
   ```bash
   python -m http.server 8000
   ```

   **Node.js（npx）を使用:**
   ```bash
   npx serve
   ```

   **PHPを使用:**
   ```bash
   php -S localhost:8000
   ```

3. ブラウザを開いて以下にアクセス:
   ```
   http://localhost:8000
   ```

## サンプルファイル

プロジェクトには、ツールをすぐに試せるサンプルアニメーションファイルが含まれています：

- **場所:** `assets/examples/sample-animation.anim`
- **使い方:**
  1. 「Remove Zeros」タブを開く
  2. サンプルファイルをアップロード
  3. オプションを設定して「Process Animation」をクリック
  4. 最適化の効果を確認

このサンプルファイルは、ツールの機能をテストしたり、Unityアニメーションフォーマットの構造を理解したりするのに役立ちます。

## 使い方ガイド

### テキストからファイルへの変換

1. **「Text to File」タブを開く**
2. **アニメーションコンテンツを貼り付け:**
   - Unity .animファイルからYAMLコンテンツをコピー
   - テキストエディタに貼り付け
3. **検証:**
   - ツールが自動的にフォーマットを検証
   - 緑のインジケーター = 有効なフォーマット
   - 赤のインジケーター = 無効なフォーマット（エディタ下部のエラーメッセージを参照）
4. **ファイル名を設定:**
   - ツールがアニメーション名を自動抽出
   - または手動でファイル名を入力
5. **ダウンロード:**
   - 「Download .anim」をクリックしてファイルを保存

### ゼロ値削除ツール

1. **「Remove Zeros」タブを開く**
2. **アニメーションファイルをアップロード:**
   - .animファイルをドラッグ&ドロップ、または
   - 「Browse Files」をクリックしてファイルを選択
3. **オプションを設定:**
   - **Remove exact zeros:** value === 0のキーフレームを削除
   - **Remove near-zeros:** 閾値内のキーフレームを削除（調整可能）
   - **Preserve first/last:** 各カーブの最初と最後のキーフレームを保持
   - **Remove empty curves:** 処理後にキーフレームがないカーブを削除
   - **Curve types:** 処理するカーブタイプを選択（Float、Position、Rotation、Scale）
4. **処理:**
   - 「Process Animation」をクリック
   - 削除されたキーフレーム数とファイルサイズ削減率の統計を表示
5. **ダウンロード:**
   - 「Download Processed File」をクリックして最適化されたアニメーションを保存

## ブラウザ互換性

このツールは以下のモダンブラウザで動作します:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 技術詳細

### 技術スタック
- **HTML5** - セマンティックマークアップ
- **CSS3** - CSS GridとFlexboxを使用したモダンなスタイリング
- **Vanilla JavaScript (ES6+)** - フレームワーク不使用、モジュラーアーキテクチャ
- **File API** - ファイルの読み取りとダウンロード用
- **Blob API** - ファイル作成用

### ファイル構成
```
unity-animation-editor/
├── index.html              # メインHTMLファイル
├── README.md              # このファイル
├── plan.md                # プロジェクト計画と仕様
├── css/
│   ├── main.css          # 基本スタイル
│   ├── layout.css        # レイアウトとグリッド
│   ├── components.css    # コンポーネントスタイル
│   └── themes.css        # カラーテーマ
└── js/
    ├── main.js           # アプリケーションエントリーポイント
    ├── config.js         # 設定定数
    ├── parsers/
    │   ├── AnimationParser.js      # Unityアニメーションフォーマットのパース
    │   └── AnimationSerializer.js  # Unityフォーマットへのシリアライズ
    ├── processors/
    │   └── ZeroRemover.js          # ゼロキーフレームの削除
    ├── ui/
    │   ├── TabManager.js           # タブナビゲーション
    │   ├── ThemeManager.js         # テーマ切り替え
    │   ├── TextToFileUI.js         # テキストからファイルへの変換UI
    │   └── RemoveZerosUI.js        # ゼロ値削除ツールUI
    └── utils/
        └── FileHandler.js          # ファイルI/O操作
```

### Unityアニメーションファイルフォーマット

Unityアニメーションファイル（.anim）は以下の構造を持つYAMLベースのテキストファイルです：

```yaml
%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!74 &7400000
AnimationClip:
  m_ObjectHideFlags: 0
  m_Name: MyAnimation
  m_SampleRate: 60
  m_WrapMode: 0
  m_FloatCurves:
  - curve:
      m_Curve:
      - serializedVersion: 3
        time: 0
        value: 1
        inSlope: 0
        outSlope: 0
        tangentMode: 136
        weightedMode: 0
        inWeight: 0.33333334
        outWeight: 0.33333334
    attribute: m_IsActive
    path: GameObject/Path
    classID: 1
  # ... より多くのカーブと設定
```

## プライバシーとセキュリティ

- **サーバー通信なし:** すべての処理がブラウザ内で完結
- **データ収集なし:** ユーザーデータの追跡や保存は一切行いません
- **アナリティクスなし:** 外部のアナリティクスやトラッキングスクリプトは使用していません
- **ローカルのみ:** アニメーションファイルがコンピュータの外に出ることはありません

## 既知の制限事項

1. **ファイルサイズ:** 最大ファイルサイズは10MB
2. **複雑なパース:** 非常に複雑または特殊なUnityアニメーションフォーマットは正しくパースできない場合があります
3. **Unityバージョン:** Unity 2019.x - 2023.xのアニメーションフォーマットでテスト済み
4. **ブラウザ必須:** JavaScriptが有効なモダンブラウザが必要

## 今後の機能拡張

将来のバージョンで予定されている機能:
- アニメーションカーブビジュアライザー
- キーフレームエディタ
- アニメーションマージャー
- サンプルレート変換
- バッチ処理
- アニメーション検証とレポート

詳細な機能仕様については [plan.md](plan.md) を参照してください。

## コントリビューション

コントリビューションを歓迎します！以下のことをお気軽に:
- バグ報告
- 新機能の提案
- プルリクエストの提出

## 開発

このプロジェクトに貢献するには:

1. リポジトリをフォーク
2. フィーチャーブランチを作成: `git checkout -b feature-name`
3. 変更を加える
4. テストを実行: `npm test`
5. 複数のブラウザで徹底的にテスト
6. 変更をコミット: `git commit -m "Add feature"`
7. ブランチにプッシュ: `git push origin feature-name`
8. プルリクエストを提出

### テストの実行

このプロジェクトは、Jestを使用したユニットテストとPlaywrightを使用したE2Eブラウザテストを含んでいます。

#### ユニットテスト

```bash
# 依存関係のインストール
npm install

# ユニットテストの実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# カバレッジレポートの生成
npm run test:coverage
```

#### E2Eブラウザテスト

実際のブラウザでの動作確認を行うE2Eテストも用意されています。

```bash
# Playwrightブラウザのインストール（初回のみ）
npx playwright install

# すべてのブラウザでE2Eテストを実行
npm run test:e2e

# Chromiumのみでテストを実行
npm run test:e2e:chromium

# ブラウザを表示してテストを実行
npm run test:e2e:headed

# Playwright Test UIでテストを実行
npm run test:e2e:ui

# ユニットテストとE2Eテストの両方を実行
npm run test:all
```

E2Eテストの詳細については [e2e/README.md](e2e/README.md) を参照してください。

テストはpushとプルリクエスト時にGitHub Actionsで自動実行されます。

### コーディング規約
- ES6+のJavaScript機能を使用
- 既存のコード構造と命名規則に従う
- 複雑なロジックにコメントを記述
- レスポンシブデザインを確保
- Chrome、Firefox、Safariでテスト

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 謝辞

- Unity開発者コミュニティのために構築
- Unity Editorを開かずに素早くアニメーションファイルを操作する必要性に触発されました

## トラブルシューティング

### よくある問題と解決策

#### ファイルのアップロードができない
- **原因:** ブラウザがFile APIをサポートしていない
- **解決策:** モダンなブラウザ（Chrome 90+、Firefox 88+、Safari 14+）を使用してください

#### 検証エラー: "Invalid YAML format"
- **原因:** アニメーションファイルのフォーマットが不正
- **解決策:**
  - Unity EditorでファイルをYAMLテキストとして開き、完全な内容をコピーしていることを確認
  - ファイルが`%YAML 1.1`で始まっていることを確認
  - 特殊文字や改行が正しく含まれていることを確認

#### 処理後にファイルサイズが変わらない
- **原因:** ファイルにゼロ値のキーフレームが含まれていない
- **解決策:**
  - 「Remove near-zeros」オプションを有効にして閾値を調整
  - アニメーションファイルの内容を確認して、最適化可能な値があるか確認

#### ローカルサーバーで "Access denied" エラー
- **原因:** ファイルパーミッションまたはCORS問題
- **解決策:**
  - `python -m http.server`または`npx serve`を使用してファイルを配信
  - `file://`プロトコルで直接開かない（一部の機能が動作しません）

#### テストが失敗する
- **原因:** Node.jsバージョンが古い、または依存関係の問題
- **解決策:**
  ```bash
  # Node.jsバージョンを確認（v16以上が必要）
  node --version

  # 依存関係を再インストール
  rm -rf node_modules package-lock.json
  npm install

  # テストを再実行
  npm test
  ```

#### ダウンロードしたファイルがUnityで読み込めない
- **原因:** ファイル拡張子が正しくない、またはフォーマットが破損
- **解決策:**
  - ファイル拡張子が`.anim`であることを確認
  - ダウンロードしたファイルをテキストエディタで開き、YAML構造が保持されているか確認
  - オリジナルファイルでツールを再度試す

### さらにサポートが必要な場合

上記の解決策で問題が解決しない場合は、以下の情報を含めてGitHub Issueを作成してください：
- 使用しているブラウザとバージョン
- エラーメッセージの全文
- 再現手順
- アニメーションファイルのサンプル（可能であれば）

## サポート

問題が発生した場合や質問がある場合:
- GitHubでissueを開く
- 既存のissueで解決策を確認
- 技術詳細については [plan.md](plan.md) を参照

## 変更履歴

### Version 1.0.0 (初回リリース)
- テキストからファイルへの変換
- 設定可能なオプションを持つゼロ値削除ツール
- ダーク/ライトテーマサポート
- ドラッグ&ドロップファイルアップロード
- リアルタイム検証
- 統計情報とサイズ削減率の表示

---

**Unity開発者のために ❤️ を込めて**
