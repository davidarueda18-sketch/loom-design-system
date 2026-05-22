import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as buttonStories from './Button.stories.tsx';

const { WebComponent, CustomEvents, CSSParts } = composeStories(buttonStories);

describe('Primitives/Button stories', () => {
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