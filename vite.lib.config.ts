import { defineConfig } from 'vite';
import type { Plugin, Rollup } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const elementEntries = Object.fromEntries(
  fs.readdirSync(path.resolve(dirname, 'src/design-system/package/elements'))
    .filter(f => f.endsWith('.ts'))
    .map(f => [
      `elements/${path.basename(f, '.ts')}`,
      path.resolve(dirname, `src/design-system/package/elements/${f}`),
    ])
);

const copyFontAssets: Plugin = {
  name: 'copy-font-assets',
  generateBundle(this: Rollup.PluginContext) {
    const fontsCSS = fs.readFileSync(
      path.resolve(dirname, 'src/design-system/package/fonts/fonts.css'),
      'utf-8',
    );
    this.emitFile({ type: 'asset', fileName: 'fonts.css', source: fontsCSS });

    const fontDir = path.resolve(dirname, 'src/assets/fonts');
    for (const file of fs.readdirSync(fontDir)) {
      if (!file.endsWith('.woff2')) continue;
      this.emitFile({
        type: 'asset',
        fileName: `fonts/${file}`,
        source: fs.readFileSync(path.join(fontDir, file)),
      });
    }
  },
};

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    dts({
      tsconfigPath: './tsconfig.lib.json',
      entryRoot: 'src/design-system/package',
    }),
    copyFontAssets,
  ],
  publicDir: false,
  build: {
    lib: {
      entry: {
        index:             path.resolve(dirname, 'src/design-system/package/index.ts'),
        core:              path.resolve(dirname, 'src/design-system/package/index.core.ts'),
        elements:          path.resolve(dirname, 'src/design-system/package/index.elements.ts'),
        'custom-elements': path.resolve(dirname, 'src/design-system/package/index.custom-elements.ts'),
        'react-jsx':       path.resolve(dirname, 'src/design-system/package/index.react-jsx.ts'),
        ...elementEntries,
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', '@vanilla-extract/css', '@angular/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: 'style[extname]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
