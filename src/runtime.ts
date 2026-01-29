// @ts-expect-error
const rpss = (window.__RPSS__ || {}) as {
  hidden?: boolean;
  getElement?: () => HTMLElement | null;
  getStyles?: () => HTMLStyleElement | null;
  hide?: () => Promise<void>;
};

export async function hideSplashScreen() {
  // Splash screen already hidden, bail out
  if (rpss.hidden) return;

  const element = rpss.getElement?.();
  const styles = rpss.getStyles?.();

  if (!element || !styles) {
    console.error(
      'Splash screen not found. Did you forget to add the `rspack-plugin-splash-screen` plugin?'
    );
    return;
  }

  await rpss.hide?.();
}
