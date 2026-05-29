import { composeStories } from '@storybook/react';
import { describe, expect, test } from 'vitest';
import * as metricCardStories from './MetricCard.stories';

const { Default, Recipes, CustomTitleSlot, WebComponent } = composeStories(metricCardStories);

describe('Components/MetricCard stories', () => {
  test('Default', async () => {
    expect(Default.args?.metric).toBe('46%');
    expect(Default.args?.description).toBe('Vulnerabilidades se encuentran retenidas por su impacto');
    await Default.run();
  });

  test('Recipes', async () => {
    await Recipes.run();
  });

  test('CustomTitleSlot', async () => {
    await CustomTitleSlot.run();
  });

  test('WebComponent', async () => {
    await WebComponent.run();
  });
});