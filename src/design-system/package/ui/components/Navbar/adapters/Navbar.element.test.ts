import { describe, expect, test } from 'vitest';
import './Navbar.element.ts';

function waitForFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

describe('LoomNavbar', () => {
  test('renders as navigation landmark and mirrors application into aria-label', async () => {
    const navbar = document.createElement('loom-navbar');
    navbar.setAttribute('application', 'Control Center');
    document.body.appendChild(navbar);
    await waitForFrame();

    expect(navbar.getAttribute('role')).toBe('navigation');
    expect(navbar.getAttribute('aria-label')).toBe('Control Center');

    const application = navbar.shadowRoot?.querySelector('[part="application"]') as HTMLSpanElement;
    expect(application.textContent).toBe('Control Center');
  });

  test('keeps consumer aria-label untouched', async () => {
    const navbar = document.createElement('loom-navbar');
    navbar.setAttribute('application', 'Control Center');
    navbar.setAttribute('aria-label', 'Main top navigation');
    document.body.appendChild(navbar);
    await waitForFrame();

    expect(navbar.getAttribute('aria-label')).toBe('Main top navigation');

    navbar.setAttribute('application', 'Admin Hub');
    await waitForFrame();

    expect(navbar.getAttribute('aria-label')).toBe('Main top navigation');
  });

  test('toggles section and divider visibility', async () => {
    const navbar = document.createElement('loom-navbar');
    navbar.setAttribute('application', 'Control Center');
    document.body.appendChild(navbar);
    await waitForFrame();

    const divider = navbar.shadowRoot?.querySelector('[part="divider"]') as HTMLSpanElement;
    const section = navbar.shadowRoot?.querySelector('[part="section"]') as HTMLSpanElement;

    expect(divider.hidden).toBe(true);
    expect(section.hidden).toBe(true);

    navbar.setAttribute('section', 'Billing');
    await waitForFrame();

    expect(divider.hidden).toBe(false);
    expect(section.hidden).toBe(false);
    expect(section.textContent).toBe('Billing');

    navbar.removeAttribute('section');
    await waitForFrame();

    expect(divider.hidden).toBe(true);
    expect(section.hidden).toBe(true);
  });
});
