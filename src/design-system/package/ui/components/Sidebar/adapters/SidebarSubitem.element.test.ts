import { describe, expect, test } from 'vitest';
import './SidebarSubitem.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomSidebarSubitem', () => {
  test('emits click/select events when activated', async () => {
    const subitem = document.createElement('loom-sidebar-subitem');
    subitem.setAttribute('item-id', 'profile');
    subitem.setAttribute('label', 'Profile');
    document.body.appendChild(subitem);
    await waitForFrame();

    const clicked: Array<{ itemId: string }> = [];
    const selected: Array<{ itemId: string; selected: boolean }> = [];

    subitem.addEventListener('loom-sidebar-item-click', (event) => {
      clicked.push((event as CustomEvent<{ itemId: string }>).detail);
    });
    subitem.addEventListener('loom-sidebar-item-select', (event) => {
      selected.push((event as CustomEvent<{ itemId: string; selected: boolean }>).detail);
    });

    subitem.click();
    await waitForFrame();

    expect(clicked).toEqual([{ itemId: 'profile' }]);
    expect(selected).toEqual([{ itemId: 'profile', selected: true }]);
  });

  test('reflects selected state into aria-current', async () => {
    const subitem = document.createElement('loom-sidebar-subitem');
    subitem.setAttribute('item-id', 'profile');
    subitem.setAttribute('label', 'Profile');
    document.body.appendChild(subitem);
    await waitForFrame();

    subitem.setAttribute('selected', '');
    await waitForFrame();

    expect(subitem.getAttribute('aria-current')).toBe('page');
  });
});
