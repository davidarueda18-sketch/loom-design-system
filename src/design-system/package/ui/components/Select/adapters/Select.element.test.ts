import { describe, expect, test } from 'vitest';
import './Select.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomSelect', () => {
  test('renders placeholder and closed combobox by default', async () => {
    const select = document.createElement('loom-select');
    select.setAttribute('placeholder', 'Choose one');
    document.body.appendChild(select);
    await waitForFrame();

    const trigger = select.shadowRoot?.querySelector('[part="trigger"]') as HTMLButtonElement;
    const value = select.shadowRoot?.querySelector('[part="value"]') as HTMLSpanElement;

    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(value.textContent).toBe('Choose one');
  });

  test('opens and closes from trigger click with events', async () => {
    const select = document.createElement('loom-select');
    const option = document.createElement('loom-select-option');
    option.setAttribute('value', 'a');
    option.setAttribute('label', 'Option A');
    select.appendChild(option);

    const opened: boolean[] = [];
    const closed: boolean[] = [];

    select.addEventListener('loom-select-open', (event) => {
      opened.push((event as CustomEvent<{ open: boolean }>).detail.open);
    });
    select.addEventListener('loom-select-close', (event) => {
      closed.push((event as CustomEvent<{ open: boolean }>).detail.open);
    });

    document.body.appendChild(select);
    await waitForFrame();

    const trigger = select.shadowRoot?.querySelector('[part="trigger"]') as HTMLButtonElement;
    trigger.click();
    await waitForFrame();

    expect(select.hasAttribute('open')).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    trigger.click();
    await waitForFrame();

    expect(select.hasAttribute('open')).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(opened).toEqual([true]);
    expect(closed).toEqual([false]);
  });

  test('selects option and emits change event', async () => {
    const select = document.createElement('loom-select');
    select.setAttribute('placeholder', 'Choose one');

    const optionA = document.createElement('loom-select-option');
    optionA.setAttribute('value', 'a');
    optionA.setAttribute('label', 'Option A');

    const optionB = document.createElement('loom-select-option');
    optionB.setAttribute('value', 'b');
    optionB.setAttribute('label', 'Option B');

    select.appendChild(optionA);
    select.appendChild(optionB);

    const changes: Array<{ value: string; label: string }> = [];
    select.addEventListener('loom-select-change', (event) => {
      changes.push((event as CustomEvent<{ value: string; label: string }>).detail);
    });

    document.body.appendChild(select);
    await waitForFrame();

    const trigger = select.shadowRoot?.querySelector('[part="trigger"]') as HTMLButtonElement;
    trigger.click();
    await waitForFrame();

    optionB.dispatchEvent(
      new CustomEvent('loom-option-select', {
        bubbles: true,
        composed: true,
        detail: { value: 'b', label: 'Option B' },
      }),
    );
    await waitForFrame();

    const value = select.shadowRoot?.querySelector('[part="value"]') as HTMLSpanElement;

    expect(select.getAttribute('value')).toBe('b');
    expect(value.textContent).toBe('Option B');
    expect(changes).toEqual([{ value: 'b', label: 'Option B' }]);
    expect(select.hasAttribute('open')).toBe(false);
  });

  test('forwards aria attributes to trigger', async () => {
    const select = document.createElement('loom-select');
    document.body.appendChild(select);

    select.setAttribute('aria-label', 'Status');
    await waitForFrame();

    const trigger = select.shadowRoot?.querySelector('[part="trigger"]') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-label')).toBe('Status');

    select.removeAttribute('aria-label');
    expect(trigger.hasAttribute('aria-label')).toBe(false);
  });

  test('keeps menu closed when disabled', async () => {
    const select = document.createElement('loom-select');
    select.setAttribute('disabled', '');

    const option = document.createElement('loom-select-option');
    option.setAttribute('value', 'a');
    option.setAttribute('label', 'Option A');
    select.appendChild(option);

    document.body.appendChild(select);
    await waitForFrame();

    const trigger = select.shadowRoot?.querySelector('[part="trigger"]') as HTMLButtonElement;
    trigger.click();
    await waitForFrame();

    expect(select.hasAttribute('open')).toBe(false);
    expect(trigger.disabled).toBe(true);
  });
});
