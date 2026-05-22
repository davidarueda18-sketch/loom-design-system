import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as textStories from './Text.stories.tsx';

const { WebComponent } = composeStories(textStories);

describe('Primitives/Text stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});