# GitHub Actions セットアップガイド

## 概要
テストスイートは実装済みですが、GitHub Actionsのワークフローファイルは権限の制限により自動プッシュできません。
以下の手順で手動で追加してください。

## セットアップ手順

### 1. ワークフローファイルを作成

GitHubリポジトリで以下のファイルを作成してください：

**ファイルパス:** `.github/workflows/test.yml`

**内容:**

```yaml
name: Run Tests

on:
  push:
    branches: [ main, master, develop, claude/** ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Generate coverage report
      run: npm run test:coverage
      if: matrix.node-version == '20.x'

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v4
      if: matrix.node-version == '20.x'
      with:
        files: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
        fail_ci_if_error: false
```

### 2. GitHub Web UIでの作成方法

1. リポジトリページに移動
2. "Actions" タブをクリック
3. "set up a workflow yourself" をクリック
4. ファイル名を `test.yml` に変更
5. 上記の内容を貼り付け
6. "Commit changes" をクリック

### 3. ローカルでの作成方法（別の方法）

```bash
# .github/workflows ディレクトリを作成
mkdir -p .github/workflows

# test.yml ファイルを作成して上記の内容を貼り付け

# コミット＆プッシュ（ワークフロー権限を持つユーザーのみ）
git add .github/workflows/test.yml
git commit -m "Add GitHub Actions workflow for testing"
git push
```

## ワークフローの機能

- ✅ プッシュとプルリクエスト時に自動実行
- ✅ Node.js 18.x と 20.x でテスト
- ✅ カバレッジレポートを生成
- ✅ Codecovにアップロード（オプション）

## テストコマンド（ローカル実行）

```bash
npm test              # テストを実行
npm run test:watch    # ウォッチモードで実行
npm run test:coverage # カバレッジレポートを生成
```

## 注意事項

ワークフローファイル `.github/workflows/test.yml` は既にローカルに存在していますが、
GitHub Appの権限制限によりプッシュできません。リポジトリの管理者権限を持つユーザーが
手動で追加する必要があります。
