import type { Preview, Decorator } from '@storybook/react-vite';
import React from 'react';

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals['theme'] as string) ?? 'dark';
  return (
    <div
      data-theme={theme === 'light' ? 'light' : undefined}
      style={{ minHeight: '100vh', background: theme === 'light' ? '#F6F6F6' : '#181818' }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'dark',  title: 'Dark (default)' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
