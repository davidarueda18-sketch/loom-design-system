import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as progressCircularStories from './ProgressCircular.stories.tsx';

const { WebComponent } = composeStories(progressCircularStories);

describe('Primitives/Progress/Circular stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});
