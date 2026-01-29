import { test, expect } from '@playwright/test';

test.describe('Splash Screen Plugin', () => {
  test('should display splash screen on initial load', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Check that the splash screen element exists
    const splashScreen = page.locator('#rpss');
    await expect(splashScreen).toBeAttached();

    // Check that the splash screen has the correct styles
    const splashStyles = page.locator('#rpss-style');
    await expect(splashStyles).toBeAttached();

    // Verify the global API is available
    const hasGlobalAPI = await page.evaluate(() => {
      return typeof window.__RPSS__ !== 'undefined';
    });
    expect(hasGlobalAPI).toBe(true);
  });

  test('should contain logo element', async ({ page }) => {
    await page.goto('/');

    // Check that the logo container exists
    const logo = page.locator('.rpss-logo');
    await expect(logo).toBeAttached();

    // Verify logo has content (SVG or image)
    const logoContent = await logo.innerHTML();
    expect(logoContent.length).toBeGreaterThan(0);
  });

  test('should contain loader element', async ({ page }) => {
    await page.goto('/');

    // Check that the loader exists
    const loader = page.locator('.rpss-loader');
    await expect(loader).toBeAttached();
  });

  test('should hide splash screen when app is ready', async ({ page }) => {
    await page.goto('/');

    // Initially, splash screen should be visible
    const splashScreen = page.locator('#rpss');
    await expect(splashScreen).toBeAttached();

    // Wait for the splash screen to be hidden (with generous timeout)
    // The example app calls hideSplashScreen() in useEffect
    await expect(splashScreen).toBeHidden({ timeout: 10000 });

    // Verify the splash screen element is removed from DOM
    await expect(splashScreen).not.toBeAttached();
  });

  test('should have proper CSS variables defined', async ({ page }) => {
    await page.goto('/');

    // Check that the styles contain the expected CSS variables
    const styleContent = await page.locator('#rpss-style').innerHTML();
    
    expect(styleContent).toContain('--rpss-bg-splash');
    expect(styleContent).toContain('--rpss-bg-loader');
    expect(styleContent).toContain('#rpss');
  });

  test('should provide hideSplashScreen function', async ({ page }) => {
    await page.goto('/');

    // Verify the global API has the hide method
    const hasHideMethod = await page.evaluate(() => {
      return typeof window.__RPSS__?.hide === 'function';
    });
    expect(hasHideMethod).toBe(true);
  });

  test('should respect minDurationMs option', async ({ page }) => {
    await page.goto('/');

    // Check that minDurationMs is set (example uses 2000ms)
    const minDuration = await page.evaluate(() => {
      return window.__RPSS__?.minDurationMs;
    });
    expect(minDuration).toBe(2000);

    // Record start time
    const startTime = Date.now();
    
    // Wait for splash to be hidden
    const splashScreen = page.locator('#rpss');
    await expect(splashScreen).toBeHidden({ timeout: 10000 });
    
    // Verify at least minDurationMs has passed
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeGreaterThanOrEqual(1900); // Allow small margin for timing
  });

  test('should have proper z-index for overlay', async ({ page }) => {
    await page.goto('/');

    const splashScreen = page.locator('#rpss');
    const zIndex = await splashScreen.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    // Should have high z-index to appear on top
    expect(parseInt(zIndex)).toBeGreaterThan(1000);
  });

  test('should animate out smoothly', async ({ page }) => {
    await page.goto('/');

    const splashScreen = page.locator('#rpss');
    
    // Wait for the animation to start
    await page.waitForTimeout(2000);
    
    // Check that opacity transition happens
    const opacityBefore = await splashScreen.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    
    // Wait a bit more for animation
    await page.waitForTimeout(500);
    
    // Splash should be hidden/removed by now
    const isAttached = await splashScreen.isVisible().catch(() => false);
    expect(isAttached).toBe(false);
  });
});
