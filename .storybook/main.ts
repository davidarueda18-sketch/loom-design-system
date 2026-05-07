import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const config: StorybookConfig = {
  stories: [
    '../src/design-system/apps/storybook/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), vanillaExtractPlugin()];
    return config;
  },
};

export default config;