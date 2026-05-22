import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as iconStories from './Icon.stories.tsx';

const { WebComponent } = composeStories(iconStories);

describe('Primitives/Icon stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});