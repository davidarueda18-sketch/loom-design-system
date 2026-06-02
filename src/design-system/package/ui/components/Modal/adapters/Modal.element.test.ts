import { describe, expect, test } from 'vitest';
import './Modal.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomModal', () => {
  test('renders dialog structure and default hidden backdrop', async () => {
    const modal = document.createElement('loom-modal');
    document.body.appendChild(modal);
    await waitForFrame();

    const backdrop = modal.shadowRoot?.querySelector('[part="backdrop"]') as HTMLDivElement;
    const dialog = modal.shadowRoot?.querySelector('[part="dialog"]') as HTMLDivElement;

    expect(backdrop.hidden).toBe(true);
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  test('shows backdrop and title when open', async () => {
    const modal = document.createElement('loom-modal');
    modal.setAttribute('title', 'Delete item');
    modal.setAttribute('open', '');
    document.body.appendChild(modal);
    await waitForFrame();

    const backdrop = modal.shadowRoot?.querySelector('[part="backdrop"]') as HTMLDivElement;
    const title = modal.shadowRoot?.querySelector('[part="title"]') as HTMLParagraphElement;

    expect(backdrop.hidden).toBe(false);
    expect(title.hidden).toBe(false);
    expect(title.textContent).toBe('Delete item');
  });

  test('dispatches close event on close button click', async () => {
    const modal = document.createElement('loom-modal');
    modal.setAttribute('open', '');
    document.body.appendChild(modal);
    await waitForFrame();

    const closes: Array<{ reason: string }> = [];
    modal.addEventListener('loom-modal-close', (event) => {
      closes.push((event as CustomEvent<{ reason: string }>).detail);
    });

    const closeBtn = modal.shadowRoot?.querySelector('[part="close-btn"]') as HTMLButtonElement;
    closeBtn.click();

    await new Promise((resolve) => {
      setTimeout(resolve, 420);
    });

    expect(modal.hasAttribute('open')).toBe(false);
    expect(closes).toEqual([{ reason: 'close' }]);
  });

  test('syncs aria-label to close button', async () => {
    const modal = document.createElement('loom-modal');
    document.body.appendChild(modal);
    await waitForFrame();

    modal.setAttribute('aria-label', 'Close dialog');
    await waitForFrame();

    const closeBtn = modal.shadowRoot?.querySelector('[part="close-btn"]') as HTMLButtonElement;
    expect(closeBtn.getAttribute('aria-label')).toBe('Close dialog');

    modal.removeAttribute('aria-label');
    await waitForFrame();

    expect(closeBtn.getAttribute('aria-label')).toBe('Cerrar');
  });

  test('closes on escape key when open', async () => {
    const modal = document.createElement('loom-modal');
    modal.setAttribute('open', '');
    document.body.appendChild(modal);
    await waitForFrame();

    const closes: Array<{ reason: string }> = [];
    modal.addEventListener('loom-modal-close', (event) => {
      closes.push((event as CustomEvent<{ reason: string }>).detail);
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    await new Promise((resolve) => {
      setTimeout(resolve, 420);
    });

    expect(modal.hasAttribute('open')).toBe(false);
    expect(closes).toEqual([{ reason: 'escape' }]);
  });
});
