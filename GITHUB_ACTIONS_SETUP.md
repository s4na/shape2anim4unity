# GitHub Actions Setup Guide

## Automated Testing Workflow

Due to GitHub App permission restrictions, the workflow file needs to be added manually.

### Quick Setup

A pre-configured workflow file `test.yml` is available in `.github/workflows/test.yml` in your repository.

To enable automated testing, you need to commit this file manually:

```bash
git add .github/workflows/test.yml
git commit -m "Add GitHub Actions workflow for automated testing"
git push
```

### Alternative: Add via GitHub Web UI

1. Go to your repository on GitHub
2. Navigate to the "Actions" tab
3. Click "New workflow"
4. Click "set up a workflow yourself"
5. Name the file `test.yml`
6. Paste the following content:

```yaml
name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - name: Checkout repository
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

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v4
      if: matrix.node-version == '20.x'
      with:
        file: ./coverage/lcov.info
        fail_ci_if_error: false
        token: ${{ secrets.CODECOV_TOKEN }}
```

7. Click "Commit changes"

### What This Workflow Does

- ✅ Runs tests automatically on every push and pull request to main/develop branches
- ✅ Tests on Node.js versions 18.x and 20.x
- ✅ Generates test coverage reports
- ✅ Optionally uploads coverage to Codecov (requires CODECOV_TOKEN secret)

### Testing Locally

Before setting up GitHub Actions, you can run tests locally:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Generate coverage
npm run test:coverage
```

All 52 tests are currently passing! ✨
