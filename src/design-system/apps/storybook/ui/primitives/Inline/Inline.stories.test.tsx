import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as inlineStories from './Inline.stories.tsx';

const { WebComponent } = composeStories(inlineStories);

describe('Primitives/Inline stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});