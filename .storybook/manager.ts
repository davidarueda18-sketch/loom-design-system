import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { darkDocsTheme, lightDocsTheme } from './docs-theme';

addons.setConfig({ theme: darkDocsTheme });

addons.getChannel().once('storiesConfigured', () => {
  addons.getChannel().on(GLOBALS_UPDATED, ({ globals }: { globals: Record<string, unknown> }) => {
    const isLight = globals['theme'] === 'light';
    addons.setConfig({ theme: isLight ? lightDocsTheme : darkDocsTheme });
  });
});
