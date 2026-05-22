import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as linkStories from './Link.stories.tsx';

const { Default } = composeStories(linkStories);

describe('Primitives/Link stories', () => {
  test('Default', async () => {
    await Default.run();
  });
});