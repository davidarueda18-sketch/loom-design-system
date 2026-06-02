import { describe, expect, test } from 'vitest';
import './TableCell.element.ts';
import './TableHeaderCell.element.ts';
import './TableRow.element.ts';
import './Table.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomTable', () => {
  test('shows empty state when no data rows are present', async () => {
    const table = document.createElement('loom-table');
    document.body.appendChild(table);
    await waitForFrame();

    const empty = table.shadowRoot?.querySelector('[part="empty"]') as HTMLDivElement;
    const grid = table.shadowRoot?.querySelector('[part="table"]') as HTMLDivElement;

    expect(empty.hidden).toBe(false);
    expect(grid.hidden).toBe(true);
  });

  test('shows grid when data rows exist', async () => {
    const table = document.createElement('loom-table');

    const row = document.createElement('loom-table-row');
    row.setAttribute('row-id', 'r-1');
    const cell = document.createElement('loom-table-cell');
    cell.textContent = 'Alpha';
    row.appendChild(cell);

    table.appendChild(row);
    document.body.appendChild(table);
    await waitForFrame();

    const empty = table.shadowRoot?.querySelector('[part="empty"]') as HTMLDivElement;
    const grid = table.shadowRoot?.querySelector('[part="table"]') as HTMLDivElement;

    expect(empty.hidden).toBe(true);
    expect(grid.hidden).toBe(false);
  });

  test('reflects loading state in aria-busy and overlay visibility', async () => {
    const table = document.createElement('loom-table');
    table.setAttribute('loading', '');
    document.body.appendChild(table);
    await waitForFrame();

    const scroll = table.shadowRoot?.querySelector('[part="scroll-container"]') as HTMLDivElement;
    const loading = table.shadowRoot?.querySelector('[part="loading"]') as HTMLDivElement;

    expect(scroll.getAttribute('aria-busy')).toBe('true');
    expect(loading.hidden).toBe(false);
  });

  test('emits selection change when a row selection event is received', async () => {
    const table = document.createElement('loom-table');
    table.setAttribute('selectable', 'multiple');

    const row = document.createElement('loom-table-row');
    row.setAttribute('row-id', 'r-1');
    row.setAttribute('selected', '');
    table.appendChild(row);

    const details: Array<{ selected: string[]; allSelected: boolean; indeterminate: boolean }> = [];
    table.addEventListener('loom-table-selection-change', (event) => {
      details.push(
        (event as CustomEvent<{ selected: string[]; allSelected: boolean; indeterminate: boolean }>).detail,
      );
    });

    document.body.appendChild(table);
    await waitForFrame();

    row.dispatchEvent(
      new CustomEvent('loom-table-row-select', {
        bubbles: true,
        composed: true,
        detail: { rowId: 'r-1', selected: true },
      }),
    );
    await waitForFrame();

    expect(details).toEqual([{ selected: ['r-1'], allSelected: true, indeterminate: false }]);
    expect(table.selectedIds).toEqual(['r-1']);
  });
});
