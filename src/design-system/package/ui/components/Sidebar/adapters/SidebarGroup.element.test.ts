import { describe, expect, test } from 'vitest';
import './SidebarGroup.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomSidebarGroup', () => {
  test('toggles expanded state and emits group toggle event on click', async () => {
    const group = document.createElement('loom-sidebar-group');
    group.setAttribute('group-id', 'settings');
    group.setAttribute('label', 'Settings');
    document.body.appendChild(group);
    await waitForFrame();

    const events: Array<{ groupId: string; expanded: boolean }> = [];
    group.addEventListener('loom-sidebar-group-toggle', (event) => {
      events.push((event as CustomEvent<{ groupId: string; expanded: boolean }>).detail);
    });

    group.click();
    await waitForFrame();

    expect(group.hasAttribute('expanded')).toBe(true);
    expect(events).toEqual([{ groupId: 'settings', expanded: true }]);
  });

  test('does not expose aria-expanded when ancestor sidebar is collapsed', async () => {
    const sidebar = document.createElement('loom-sidebar');
    sidebar.setAttribute('collapsed', '');

    const group = document.createElement('loom-sidebar-group');
    group.setAttribute('group-id', 'settings');
    group.setAttribute('label', 'Settings');
    group.setAttribute('expanded', '');

    sidebar.appendChild(group);
    document.body.appendChild(sidebar);
    await waitForFrame();

    group.requestSync();
    await waitForFrame();

    expect(group.hasAttribute('aria-expanded')).toBe(false);
  });
});
