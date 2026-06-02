import { describe, expect, test } from 'vitest';
import './TableHeaderCell.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomTableHeaderCell', () => {
  test('renders with columnheader role', async () => {
    const cell = document.createElement('loom-table-header-cell');
    document.body.appendChild(cell);
    await waitForFrame();

    expect(cell.getAttribute('role')).toBe('columnheader');
  });

  test('cycles sorting and emits sort change event', async () => {
    const cell = document.createElement('loom-table-header-cell');
    cell.setAttribute('column-id', 'name');
    cell.setAttribute('sort', 'none');
    document.body.appendChild(cell);
    await waitForFrame();

    const events: Array<{ columnId: string; direction: string }> = [];
    cell.addEventListener('loom-table-sort-change', (event) => {
      events.push((event as CustomEvent<{ columnId: string; direction: string }>).detail);
    });

    const btn = cell.shadowRoot?.querySelector('[part="sort-icon"]') as HTMLButtonElement;
    btn.click();
    await waitForFrame();

    expect(cell.getAttribute('sort')).toBe('asc');
    expect(cell.getAttribute('aria-sort')).toBe('ascending');
    expect(events).toEqual([{ columnId: 'name', direction: 'asc' }]);
  });
});
