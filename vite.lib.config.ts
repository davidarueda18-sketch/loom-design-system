import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const copyFontAssets = {
  name: 'copy-font-assets',
  generateBundle() {
    const fontsCSS = fs.readFileSync(
      path.resolve(dirname, 'src/design-system/package/fonts/fonts.css'),
      'utf-8',
    );
    (this as any).emitFile({ type: 'asset', fileName: 'fonts.css', source: fontsCSS });

    const fontDir = path.resolve(dirname, 'src/assets/fonts');
    for (const file of fs.readdirSync(fontDir)) {
      if (!file.endsWith('.woff2')) continue;
      (this as any).emitFile({
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
    }),
    copyFontAssets,
  ],
  publicDir: false,
  build: {
    lib: {
      entry: path.resolve(dirname, 'src/design-system/package/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', '@vanilla-extract/css'],
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
