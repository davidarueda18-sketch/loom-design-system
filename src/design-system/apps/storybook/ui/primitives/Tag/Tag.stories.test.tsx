import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as tagStories from './Tag.stories.tsx';

const { WebComponent } = composeStories(tagStories);

describe('Primitives/Tag stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});
