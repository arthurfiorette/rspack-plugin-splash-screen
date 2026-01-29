/**
 * Global splash screen API injected by the plugin
 * @public
 */
export interface SplashScreenAPI {
  /** Unique ID of the splash screen element */
  id: string;
  /** Whether the splash screen has been hidden */
  hidden?: boolean;
  /** Timestamp when splash screen was rendered */
  renderedAt?: number;
  /** Minimum duration in milliseconds before allowing hide */
  minDurationMs?: number;
  /** Get the splash screen DOM element */
  getElement?: () => HTMLElement | null;
  /** Get the splash screen styles element */
  getStyles?: () => HTMLStyleElement | null;
  /** Get the splash screen script element */
  getScript?: () => HTMLScriptElement | null;
  /** Hide the splash screen with animation */
  hide?: () => Promise<void>;
  /** Show the splash screen */
  show?: () => void;
  /** Remove splash screen completely from DOM */
  remove?: () => void;
}

declare global {
  interface Window {
    __RPSS__?: SplashScreenAPI;
  }
}

/**
 * Hides the splash screen with a smooth fade-out animation.
 * This function respects the `minDurationMs` option if configured.
 *
 * @example
 * ```typescript
 * import { hideSplashScreen } from 'rspack-plugin-splash-screen/runtime';
 *
 * // Hide splash screen after app initialization
 * await hideSplashScreen();
 * ```
 *
 * @public
 */
export async function hideSplashScreen() {
  const rpss: SplashScreenAPI = window.__RPSS__ || { id: 'rpss' };

  // Splash screen already hidden, bail out
  if (rpss.hidden) return;

  const element = rpss.getElement?.();
  const styles = rpss.getStyles?.();
  const script = rpss.getScript?.();

  if (!element || !styles || !script) {
    console.error(
      'Splash screen not found. Did you forget to add the `rspack-plugin-splash-screen` plugin?'
    );
    return;
  }

  await rpss.hide?.();
}
