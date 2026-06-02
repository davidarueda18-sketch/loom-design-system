import { describe, expect, test } from 'vitest';
import './SidebarItem.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomSidebarItem', () => {
  test('emits click/select events when activated', async () => {
    const item = document.createElement('loom-sidebar-item');
    item.setAttribute('item-id', 'home');
    item.setAttribute('label', 'Home');
    document.body.appendChild(item);
    await waitForFrame();

    const clicked: Array<{ itemId: string }> = [];
    const selected: Array<{ itemId: string; selected: boolean }> = [];

    item.addEventListener('loom-sidebar-item-click', (event) => {
      clicked.push((event as CustomEvent<{ itemId: string }>).detail);
    });
    item.addEventListener('loom-sidebar-item-select', (event) => {
      selected.push((event as CustomEvent<{ itemId: string; selected: boolean }>).detail);
    });

    item.click();
    await waitForFrame();

    expect(clicked).toEqual([{ itemId: 'home' }]);
    expect(selected).toEqual([{ itemId: 'home', selected: true }]);
  });

  test('exposes label as aria-label when sidebar is collapsed', async () => {
    const sidebar = document.createElement('loom-sidebar');
    sidebar.setAttribute('collapsed', '');

    const item = document.createElement('loom-sidebar-item');
    item.setAttribute('item-id', 'reports');
    item.setAttribute('label', 'Reports');
    sidebar.appendChild(item);

    document.body.appendChild(sidebar);
    await waitForFrame();

    item.requestSync();
    await waitForFrame();

    expect(item.getAttribute('aria-label')).toBe('Reports');
    expect(item.getAttribute('title')).toBe('Reports');
  });
});
