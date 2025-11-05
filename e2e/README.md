# E2E Browser Tests

このディレクトリには、Unity Animation Editorのブラウザでの動作確認を行うE2Eテストが含まれています。

## 概要

Playwrightを使用して、実際のブラウザでアプリケーションの動作を自動テストします。

## テスト内容

### text-to-file.spec.js
- Text to File Converterタブの機能テスト
- YAMLコンテンツの検証
- ダウンロード機能のテスト
- クリア機能のテスト

### blendshape-import.spec.js
- BlendShape Importタブの機能テスト
- JSONコンテンツの検証
- アニメーション生成機能のテスト
- マルチフレームモードの切り替えテスト

### ui-interactions.spec.js
- タブナビゲーションのテスト
- テーマ切り替え（ライト/ダーク）のテスト
- 言語切り替え（日本語/英語）のテスト
- ヘッダー要素のテスト
- ステータスバーのテスト
- レスポンシブデザインのテスト

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### ブラウザのインストール

```bash
npx playwright install
```

または、特定のブラウザのみをインストール：

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## テストの実行

### すべてのブラウザでテストを実行

```bash
npm run test:e2e
```

### ヘッド付きモード（ブラウザを表示）で実行

```bash
npm run test:e2e:headed
```

### Playwright Test UIで実行

```bash
npm run test:e2e:ui
```

### 特定のブラウザでのみ実行

```bash
npm run test:e2e:chromium   # Chromiumのみ
npm run test:e2e:firefox    # Firefoxのみ
npm run test:e2e:webkit     # WebKitのみ
```

### ユニットテストとE2Eテストの両方を実行

```bash
npm run test:all
```

## 設定

テストの設定は `playwright.config.js` で行います。

- **テストディレクトリ**: `./e2e`
- **タイムアウト**: 30秒
- **ベースURL**: `http://localhost:8080`
- **自動リトライ**: CI環境では2回
- **スクリーンショット**: 失敗時のみ
- **トレース**: 最初のリトライ時

## CI/CD

GitHub ActionsなどのCI環境でテストを実行する場合、以下のように設定してください：

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

## トラブルシューティング

### ブラウザが起動しない

ブラウザがインストールされていることを確認してください：

```bash
npx playwright install
```

### テストがタイムアウトする

`playwright.config.js` の `timeout` 設定を調整してください。

### ポート8080が使用中

別のアプリケーションがポート8080を使用している場合、`playwright.config.js` の `webServer.command` と `baseURL` を変更してください。

## 参考資料

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Playwright Test ドキュメント](https://playwright.dev/docs/test-intro)
