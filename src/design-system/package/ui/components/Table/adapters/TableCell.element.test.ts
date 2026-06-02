import { describe, expect, test } from 'vitest';
import './TableCell.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomTableCell', () => {
  test('renders with cell role by default', async () => {
    const cell = document.createElement('loom-table-cell');
    document.body.appendChild(cell);
    await waitForFrame();

    expect(cell.getAttribute('role')).toBe('cell');
  });

  test('applies colspan custom property when col-span is provided', async () => {
    const cell = document.createElement('loom-table-cell');
    cell.setAttribute('col-span', '3');
    document.body.appendChild(cell);
    await waitForFrame();

    expect(cell.style.getPropertyValue('--loom-cell-col-span')).toBe('span 3');
  });

  test('shows mobile label part when mobile-label is present', async () => {
    const cell = document.createElement('loom-table-cell');
    cell.setAttribute('mobile-label', 'Name');
    document.body.appendChild(cell);
    await waitForFrame();

    const mobileLabel = cell.shadowRoot?.querySelector('[part="mobile-label"]') as HTMLSpanElement;
    expect(mobileLabel.hidden).toBe(false);
    expect(mobileLabel.textContent).toBe('Name');
  });
});
