import { describe, expect, test } from 'vitest';
import './TableExpansion.element.ts';
import './TableRow.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomTableRow', () => {
  test('emits row click when interactive', async () => {
    const row = document.createElement('loom-table-row');
    row.setAttribute('row-id', 'r-1');
    row.setAttribute('interactive', '');
    document.body.appendChild(row);
    await waitForFrame();

    const clicks: Array<{ rowId: string }> = [];
    row.addEventListener('loom-table-row-click', (event) => {
      clicks.push((event as CustomEvent<{ rowId: string }>).detail);
    });

    row.click();
    await waitForFrame();

    expect(clicks).toEqual([{ rowId: 'r-1' }]);
  });

  test('toggles selection on click when table selectable is single', async () => {
    const table = document.createElement('loom-table');
    table.setAttribute('selectable', 'single');

    const row = document.createElement('loom-table-row');
    row.setAttribute('row-id', 'r-2');
    table.appendChild(row);

    document.body.appendChild(table);
    await waitForFrame();

    const selected: Array<{ rowId: string; selected: boolean }> = [];
    row.addEventListener('loom-table-row-select', (event) => {
      selected.push((event as CustomEvent<{ rowId: string; selected: boolean }>).detail);
    });

    row.click();
    await waitForFrame();

    expect(row.hasAttribute('selected')).toBe(true);
    expect(selected).toEqual([{ rowId: 'r-2', selected: true }]);
  });

  test('emits toggle event from keyboard arrows when expandable', async () => {
    const row = document.createElement('loom-table-row');
    row.setAttribute('row-id', 'r-3');
    row.setAttribute('expandable', '');
    document.body.appendChild(row);
    await waitForFrame();

    const toggles: Array<{ rowId: string; expanded: boolean }> = [];
    row.addEventListener('loom-table-row-toggle', (event) => {
      toggles.push((event as CustomEvent<{ rowId: string; expanded: boolean }>).detail);
    });

    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await waitForFrame();

    expect(row.hasAttribute('expanded')).toBe(true);
    expect(toggles).toEqual([{ rowId: 'r-3', expanded: true }]);
  });
});
