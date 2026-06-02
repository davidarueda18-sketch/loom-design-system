import { describe, expect, test } from 'vitest';
import './TableExpansion.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomTableExpansion', () => {
  test('initializes as region and hidden for assistive tech when collapsed', async () => {
    const expansion = document.createElement('loom-table-expansion');
    document.body.appendChild(expansion);
    await waitForFrame();

    expect(expansion.getAttribute('role')).toBe('region');
    expect(expansion.hasAttribute('aria-hidden')).toBe(false);
  });

  test('updates aria-hidden when expanded', async () => {
    const expansion = document.createElement('loom-table-expansion');
    document.body.appendChild(expansion);
    await waitForFrame();

    expansion.setAttribute('expanded', '');
    await waitForFrame();

    expect(expansion.getAttribute('aria-hidden')).toBe('false');
  });
});
