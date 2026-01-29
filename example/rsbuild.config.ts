import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { RspackSplashScreenPlugin } from 'rspack-plugin-splash-screen';

const base = '/rspack-plugin-splash-screen/';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    assetPrefix: base
  },
  source: {
    entry: {
      index: './src/main.tsx'
    }
  },
  tools: {
    rspack: {
      plugins: [
        new RspackSplashScreenPlugin({
          minDurationMs: 2000,
          logoSrc: 'rspack.svg',
          loaderType: 'line',
          loaderBg: 'linear-gradient(279deg, #ff8b00 35.21%, #f93920 63.34%)',
          splashBg: '#121212'
        })
      ]
    }
  },
  server: {
    port: 4000,
    base
  }
});
