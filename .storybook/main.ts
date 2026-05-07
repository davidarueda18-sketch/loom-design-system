import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), vanillaExtractPlugin()];
    return config;
  },
};

export default config;