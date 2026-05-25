import { composeStories } from '@storybook/react';
import { describe, test } from 'vitest';
import * as stepperStepStories from './StepperStep.stories.tsx';

const { WebComponent } = composeStories(stepperStepStories);

describe('Primitives/StepperStep stories', () => {
  test('WebComponent', async () => {
    await WebComponent.run();
  });
});
