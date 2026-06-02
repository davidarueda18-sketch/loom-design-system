import { describe, expect, test } from 'vitest';
import './Checkbox.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomCheckbox', () => {
  test('renders with checkbox role and unchecked default state', async () => {
    const element = document.createElement('loom-checkbox');
    document.body.appendChild(element);
    await waitForFrame();

    expect(element.getAttribute('role')).toBe('checkbox');
    expect(element.getAttribute('aria-checked')).toBe('false');

    const box = element.shadowRoot?.querySelector('[part="box"]');
    expect(box).toBeInstanceOf(HTMLElement);
    expect(box?.getAttribute('tabindex')).toBe('0');
  });

  test('toggles checked state and emits change event on click', async () => {
    const element = document.createElement('loom-checkbox');
    document.body.appendChild(element);

    const events: Array<{ checked: boolean; indeterminate: boolean }> = [];
    element.addEventListener('loom-checkbox-change', (event) => {
      events.push((event as CustomEvent<{ checked: boolean; indeterminate: boolean }>).detail);
    });

    const box = element.shadowRoot?.querySelector('[part="box"]') as HTMLElement;
    box.click();
    await waitForFrame();

    expect(element.hasAttribute('checked')).toBe(true);
    expect(element.getAttribute('aria-checked')).toBe('true');
    expect(events).toEqual([{ checked: true, indeterminate: false }]);
  });

  test('promotes indeterminate state to checked on first toggle', async () => {
    const element = document.createElement('loom-checkbox');
    element.setAttribute('indeterminate', '');
    document.body.appendChild(element);
    await waitForFrame();

    expect(element.getAttribute('aria-checked')).toBe('mixed');

    const box = element.shadowRoot?.querySelector('[part="box"]') as HTMLElement;
    box.click();
    await waitForFrame();

    expect(element.hasAttribute('indeterminate')).toBe(false);
    expect(element.hasAttribute('checked')).toBe(true);
    expect(element.getAttribute('aria-checked')).toBe('true');
  });

  test('does not toggle when disabled', async () => {
    const element = document.createElement('loom-checkbox');
    element.setAttribute('disabled', '');
    document.body.appendChild(element);
    await waitForFrame();

    const events: Array<{ checked: boolean; indeterminate: boolean }> = [];
    element.addEventListener('loom-checkbox-change', (event) => {
      events.push((event as CustomEvent<{ checked: boolean; indeterminate: boolean }>).detail);
    });

    const box = element.shadowRoot?.querySelector('[part="box"]') as HTMLElement;
    box.click();
    await waitForFrame();

    expect(element.hasAttribute('checked')).toBe(false);
    expect(events).toEqual([]);
    expect(box.getAttribute('tabindex')).toBe('-1');
  });
});
