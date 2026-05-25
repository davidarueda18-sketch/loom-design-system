import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as badgeStories from './Badge.stories.tsx';

const { WebComponent } = composeStories(badgeStories);

describe('Primitives/Badge stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});
