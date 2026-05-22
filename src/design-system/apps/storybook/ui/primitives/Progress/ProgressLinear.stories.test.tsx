import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as progressLinearStories from './ProgressLinear.stories.tsx';

const { WebComponent } = composeStories(progressLinearStories);

describe('Primitives/Progress/Linear stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});
