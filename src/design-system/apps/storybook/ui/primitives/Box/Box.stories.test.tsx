import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as boxStories from './Box.stories.tsx';

const { WebComponent } = composeStories(boxStories);

describe('Primitives/Box stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});