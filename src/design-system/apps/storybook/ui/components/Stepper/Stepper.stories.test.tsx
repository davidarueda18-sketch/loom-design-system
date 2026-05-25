import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as stepperStories from './Stepper.stories.tsx';

const { WebComponent } = composeStories(stepperStories);

describe('Components/Stepper stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});
