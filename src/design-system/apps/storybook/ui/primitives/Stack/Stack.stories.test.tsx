import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as stackStories from './Stack.stories.tsx';

const { WebComponent } = composeStories(stackStories);

describe('Primitives/Stack stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});