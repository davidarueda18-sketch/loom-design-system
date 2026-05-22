import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as dividerStories from './Divider.stories.tsx';

const { WebComponent } = composeStories(dividerStories);

describe('Primitives/Divider stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});