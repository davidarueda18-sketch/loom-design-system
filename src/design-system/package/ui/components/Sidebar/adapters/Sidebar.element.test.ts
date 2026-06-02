import { describe, expect, test } from 'vitest';
import './SidebarItem.element.ts';
import './SidebarSubitem.element.ts';
import './SidebarGroup.element.ts';
import './Sidebar.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomSidebar', () => {
  test('toggles collapsed state and emits toggle event', async () => {
    const sidebar = document.createElement('loom-sidebar');
    document.body.appendChild(sidebar);
    await waitForFrame();

    const events: Array<{ collapsed: boolean }> = [];
    sidebar.addEventListener('loom-sidebar-toggle', (event) => {
      events.push((event as CustomEvent<{ collapsed: boolean }>).detail);
    });

    const toggle = sidebar.shadowRoot?.querySelector('[part="toggle"]') as HTMLButtonElement;
    toggle.click();
    await waitForFrame();

    expect(sidebar.hasAttribute('collapsed')).toBe(true);
    expect(events).toEqual([{ collapsed: true }]);
  });

  test('emits select event and applies single selection', async () => {
    const sidebar = document.createElement('loom-sidebar');

    const itemA = document.createElement('loom-sidebar-item');
    itemA.setAttribute('item-id', 'dashboard');
    itemA.setAttribute('label', 'Dashboard');

    const itemB = document.createElement('loom-sidebar-item');
    itemB.setAttribute('item-id', 'reports');
    itemB.setAttribute('label', 'Reports');

    sidebar.appendChild(itemA);
    sidebar.appendChild(itemB);

    const selections: Array<{ id: string }> = [];
    sidebar.addEventListener('loom-sidebar-select', (event) => {
      selections.push((event as CustomEvent<{ id: string }>).detail);
    });

    document.body.appendChild(sidebar);
    await waitForFrame();

    itemA.click();
    await waitForFrame();
    expect(itemA.hasAttribute('selected')).toBe(true);

    itemB.click();
    await waitForFrame();

    expect(itemA.hasAttribute('selected')).toBe(false);
    expect(itemB.hasAttribute('selected')).toBe(true);
    expect(selections).toEqual([{ id: 'dashboard' }, { id: 'reports' }]);
  });

  test('selecting a subitem marks its group as selected', async () => {
    const sidebar = document.createElement('loom-sidebar');

    const group = document.createElement('loom-sidebar-group');
    group.setAttribute('group-id', 'settings');
    group.setAttribute('label', 'Settings');
    group.setAttribute('expanded', '');

    const subitem = document.createElement('loom-sidebar-subitem');
    subitem.setAttribute('item-id', 'profile');
    subitem.setAttribute('label', 'Profile');

    group.appendChild(subitem);
    sidebar.appendChild(group);

    document.body.appendChild(sidebar);
    await waitForFrame();

    subitem.click();
    await waitForFrame();

    expect(subitem.hasAttribute('selected')).toBe(true);
    expect(group.hasAttribute('selected')).toBe(true);
  });
});
