import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  optimizeDeps: {
    include: ['@storybook/react'],
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: [
            'src/design-system/package/ui/**/*.test.ts',
            'src/design-system/package/ui/**/*.test.tsx',
            'src/design-system/package/ui/**/*.spec.ts',
            'src/design-system/package/ui/**/*.spec.tsx',
          ],
          setupFiles: [path.join(dirname, 'src/design-system/package/test/unit-test.setup.ts')],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'storybook',
          include: [
            'src/design-system/apps/storybook/**/*.stories.test.tsx',
          ],
          setupFiles: [path.join(dirname, 'src/design-system/apps/storybook/storybook-test.setup.ts')],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});