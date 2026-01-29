import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      // Plugin entry
      format: ['esm', 'cjs'],
      syntax: 'es2021',
      dts: true,
      source: {
        entry: {
          plugin: './src/plugin.ts',
        },
      },
      output: {
        distPath: {
          root: './dist/plugin',
        },
      },
    },
    {
      // Runtime entry
      format: ['esm', 'cjs'],
      syntax: 'es2021',
      dts: true,
      source: {
        entry: {
          runtime: './src/runtime.ts',
        },
      },
      output: {
        distPath: {
          root: './dist/runtime',
        },
      },
    },
  ],
});
