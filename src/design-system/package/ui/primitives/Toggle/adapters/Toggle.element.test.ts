import { describe, expect, test } from 'vitest';
import './Toggle.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomToggle', () => {
  test('renders with switch role and default unchecked state', async () => {
    const element = document.createElement('loom-toggle');
    document.body.appendChild(element);
    await waitForFrame();

    expect(element.getAttribute('role')).toBe('switch');
    expect(element.getAttribute('aria-checked')).toBe('false');

    const track = element.shadowRoot?.querySelector('[part="track"]');
    expect(track).toBeInstanceOf(HTMLElement);
    expect(track?.getAttribute('tabindex')).toBe('0');
  });

  test('toggles on click and dispatches change event', async () => {
    const element = document.createElement('loom-toggle');
    document.body.appendChild(element);

    const events: Array<{ checked: boolean }> = [];
    element.addEventListener('loom-toggle-change', (event) => {
      events.push((event as CustomEvent<{ checked: boolean }>).detail);
    });

    const track = element.shadowRoot?.querySelector('[part="track"]') as HTMLElement;
    track.click();
    await waitForFrame();

    expect(element.hasAttribute('checked')).toBe(true);
    expect(element.getAttribute('aria-checked')).toBe('true');
    expect(events).toEqual([{ checked: true }]);
  });

  test('does not toggle when disabled', async () => {
    const element = document.createElement('loom-toggle');
    element.setAttribute('disabled', '');
    document.body.appendChild(element);
    await waitForFrame();

    const events: Array<{ checked: boolean }> = [];
    element.addEventListener('loom-toggle-change', (event) => {
      events.push((event as CustomEvent<{ checked: boolean }>).detail);
    });

    const track = element.shadowRoot?.querySelector('[part="track"]') as HTMLElement;
    track.click();
    await waitForFrame();

    expect(element.hasAttribute('checked')).toBe(false);
    expect(events).toEqual([]);
    expect(track.getAttribute('tabindex')).toBe('-1');
  });

  test('forwards aria label attributes to track part', async () => {
    const element = document.createElement('loom-toggle');
    document.body.appendChild(element);

    element.setAttribute('aria-label', 'Enable notifications');
    await waitForFrame();

    const track = element.shadowRoot?.querySelector('[part="track"]') as HTMLElement;
    expect(track.getAttribute('aria-label')).toBe('Enable notifications');

    element.removeAttribute('aria-label');
    expect(track.hasAttribute('aria-label')).toBe(false);
  });
});
