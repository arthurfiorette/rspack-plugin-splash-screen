import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      // Plugin entry - ESM
      format: 'esm',
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
      tools: {
        rspack: {
          module: {
            rules: [
              {
                resourceQuery: /raw/,
                type: 'asset/source',
              },
            ],
          },
        },
      },
    },
    {
      // Plugin entry - CJS
      format: 'cjs',
      syntax: 'es2021',
      dts: false, // Only generate types once
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
      tools: {
        rspack: {
          module: {
            rules: [
              {
                resourceQuery: /raw/,
                type: 'asset/source',
              },
            ],
          },
        },
      },
    },
    {
      // Runtime entry - ESM
      format: 'esm',
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
    {
      // Runtime entry - CJS
      format: 'cjs',
      syntax: 'es2021',
      dts: false, // Only generate types once
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
