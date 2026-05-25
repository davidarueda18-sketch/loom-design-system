import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as checkboxStories from './Checkbox.stories.tsx';

const { WebComponent } = composeStories(checkboxStories);

describe('Primitives/Checkbox stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});
