import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as fabStories from './Fab.stories.tsx';

const { WebComponent, CustomEvents, CSSParts } = composeStories(fabStories);

describe('Primitives/Fab stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });

  test('CustomEvents', async () => {
    await CustomEvents.run();
  });

  test('CSSParts', async () => {
    await CSSParts.run();
  });
});
