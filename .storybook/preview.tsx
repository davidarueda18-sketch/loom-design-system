/* eslint-disable react-refresh/only-export-components */
import type { Preview, Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';
import { darkDocsTheme, lightDocsTheme } from './docs-theme';

// Shared object — mutated by the decorator to switch theme without re-creating the ref.
const docsParams = { theme: darkDocsTheme, story: { inline: true } };

type ThemeFrameProps = {
  isLight: boolean;
  viewMode: string;
  children: React.ReactNode;
};

function ThemeFrame({ isLight, viewMode, children }: ThemeFrameProps) {
  useEffect(() => {
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
      document.body.style.backgroundColor = '#F6F6F6';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.removeAttribute('data-theme');
      document.body.style.backgroundColor = '#181818';
    }
    // No cleanup: in docs mode multiple decorator instances share the same body.
    // Removing data-theme on unmount would break sibling stories still in the DOM.
  }, [isLight]);

  return (
    <div
      data-theme={isLight ? 'light' : undefined}
      style={{
        minHeight: viewMode === 'story' ? '100vh' : undefined,
        backgroundColor: isLight ? '#F6F6F6' : '#181818',
        color: isLight ? '#1A1A1A' : '#FFFFFF',
      }}
    >
      {children}
    </div>
  );
}

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals['theme'] as string) ?? 'dark';
  const isLight = theme === 'light';

  // Sync Storybook's docs theme with the toolbar selection.
  // Mutating the shared docsParams object updates all story instances consistently.
  docsParams.theme = isLight ? lightDocsTheme : darkDocsTheme;
  context.parameters['docs'] = docsParams;

  return (
    <ThemeFrame isLight={isLight} viewMode={context.viewMode}>
      <Story />
    </ThemeFrame>
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
    docs: docsParams,
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
