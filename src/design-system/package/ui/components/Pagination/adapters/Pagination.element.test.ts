import { describe, expect, test } from 'vitest';
import './Pagination.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomPagination', () => {
  test('renders navigation defaults and controls', async () => {
    const pagination = document.createElement('loom-pagination');
    pagination.setAttribute('total-items', '50');
    document.body.appendChild(pagination);
    await waitForFrame();

    expect(pagination.getAttribute('role')).toBe('navigation');
    expect(pagination.getAttribute('aria-label')).toBe('Paginación');

    const prev = pagination.shadowRoot?.querySelector('[part="prev"]') as HTMLElement;
    const next = pagination.shadowRoot?.querySelector('[part="next"]') as HTMLElement;

    expect(prev.hasAttribute('disabled')).toBe(true);
    expect(next.hasAttribute('disabled')).toBe(false);
  });

  test('emits change event when navigating to next page', async () => {
    const pagination = document.createElement('loom-pagination');
    pagination.setAttribute('total-items', '50');
    pagination.setAttribute('page-size', '10');
    document.body.appendChild(pagination);
    await waitForFrame();

    const changes: Array<{ page: number; pageSize: number }> = [];
    pagination.addEventListener('loom-pagination-change', (event) => {
      changes.push((event as CustomEvent<{ page: number; pageSize: number }>).detail);
    });

    const next = pagination.shadowRoot?.querySelector('[part="next"]') as HTMLElement;
    next.click();
    await waitForFrame();

    expect(pagination.getAttribute('page')).toBe('2');
    expect(changes).toEqual([{ page: 2, pageSize: 10 }]);
  });

  test('clamps page navigation to valid bounds', async () => {
    const pagination = document.createElement('loom-pagination');
    pagination.setAttribute('total-items', '20');
    pagination.setAttribute('page-size', '10');
    pagination.setAttribute('page', '2');
    document.body.appendChild(pagination);
    await waitForFrame();

    const events: Array<{ page: number; pageSize: number }> = [];
    pagination.addEventListener('loom-pagination-change', (event) => {
      events.push((event as CustomEvent<{ page: number; pageSize: number }>).detail);
    });

    const next = pagination.shadowRoot?.querySelector('[part="next"]') as HTMLElement;
    next.click();
    await waitForFrame();

    expect(pagination.getAttribute('page')).toBe('2');
    expect(events).toEqual([]);
  });

  test('renders and emits page-size selector changes', async () => {
    const pagination = document.createElement('loom-pagination');
    pagination.setAttribute('total-items', '200');
    pagination.setAttribute('page-size', '10');
    pagination.setAttribute('page-size-options', '10, 20, 50');
    document.body.appendChild(pagination);
    await waitForFrame();

    const sizes: Array<{ pageSize: number }> = [];
    pagination.addEventListener('loom-pagination-size-change', (event) => {
      sizes.push((event as CustomEvent<{ pageSize: number }>).detail);
    });

    const select = pagination.shadowRoot?.querySelector('select') as HTMLSelectElement;
    expect(select).toBeInstanceOf(HTMLSelectElement);
    expect(select.value).toBe('10');

    select.value = '20';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await waitForFrame();

    expect(pagination.getAttribute('page-size')).toBe('20');
    expect(sizes).toEqual([{ pageSize: 20 }]);
  });

  test('disables interactions when component is disabled', async () => {
    const pagination = document.createElement('loom-pagination');
    pagination.setAttribute('total-items', '50');
    pagination.setAttribute('page-size', '10');
    pagination.setAttribute('page-size-options', '10, 20');
    pagination.setAttribute('page', '2');
    pagination.setAttribute('disabled', '');
    document.body.appendChild(pagination);
    await waitForFrame();

    const changes: Array<{ page: number; pageSize: number }> = [];
    pagination.addEventListener('loom-pagination-change', (event) => {
      changes.push((event as CustomEvent<{ page: number; pageSize: number }>).detail);
    });

    const next = pagination.shadowRoot?.querySelector('[part="next"]') as HTMLElement;
    next.click();
    await waitForFrame();

    expect(pagination.getAttribute('page')).toBe('2');
    expect(changes).toEqual([]);

    const select = pagination.shadowRoot?.querySelector('select') as HTMLSelectElement;
    if (select) {
      expect(select.disabled).toBe(true);
    }
  });
});
