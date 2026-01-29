import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { splashScreen } from 'rspack-plugin-splash-screen';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  tools: {
    rspack: {
      plugins: [
        splashScreen({
          minDurationMs: 2000, // show splash screen for at least 2 seconds
          logoSrc: 'vite.svg',
          loaderType: 'line',
          loaderBg: '#ffcb29',
          splashBg: '#242424',
        }),
      ],
    },
  },
  server: {
    port: 4000,
  },
});
