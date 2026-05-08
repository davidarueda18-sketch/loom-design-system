import type { Preview, Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals['theme'] as string) ?? 'dark';
  const isLight = theme === 'light';
  const isCanvas = context.viewMode === 'story';
  const bg = isLight ? '' : '#181818';

  // In canvas mode, extend the background beyond the story wrapper to cover
  // the full iframe (areas outside the component when layout is 'centered').
  useEffect(() => {
    if (!isCanvas) return;
    document.body.style.background = bg;
    return () => { document.body.style.background = ''; };
  }, [bg, isCanvas]);

  return (
    <div
      data-theme={isLight ? 'light' : undefined}
      style={{
        background: bg,
        minHeight: isCanvas ? '100vh' : undefined,
      }}
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
    layout: 'padded',
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
