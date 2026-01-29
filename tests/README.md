# E2E Tests

This directory contains end-to-end tests for the rspack-plugin-splash-screen using Playwright.

## Running Tests

```bash
# Install dependencies (if not already installed)
pnpm install

# Build the plugin and example
pnpm run build
cd example && pnpm run build && cd ..

# Run tests
pnpm run test

# Run tests with UI mode for debugging
pnpm run test:ui
```

## Test Coverage

The test suite validates:

1. **Splash Screen Display** - Verifies the splash screen element exists on initial load
2. **Logo Element** - Confirms the logo container is present with content
3. **Loader Element** - Checks that the loading indicator exists
4. **Hide Functionality** - Tests that the splash screen hides when the app is ready
5. **CSS Variables** - Validates proper CSS variable definitions
6. **Global API** - Ensures `window.__RPSS__` is available with expected methods
7. **Min Duration** - Verifies the `minDurationMs` option is respected
8. **Z-Index** - Confirms proper layering with high z-index
9. **Animation** - Tests smooth fade-out animation

## CI/CD Integration

The tests are designed to run in CI environments:
- Uses headless Chromium browser
- Automatically starts the preview server
- Configured with appropriate timeouts and retries
- Generates HTML report for debugging failures

## Configuration

See `playwright.config.ts` for test configuration including:
- Browser settings
- Server configuration
- Timeouts and retries
- Reporter options
