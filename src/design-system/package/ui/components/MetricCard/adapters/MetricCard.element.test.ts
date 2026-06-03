import { describe, expect, test } from 'vitest';
import './MetricCard.element.ts';

const nextFrame = () => new Promise<void>((resolve) => { requestAnimationFrame(() => { resolve(); }); });

function getShadowPart<T extends HTMLElement>(card: HTMLElementTagNameMap['loom-metric-card'], part: string): T {
  const element = card.shadowRoot?.querySelector<T>(`[part="${part}"]`);
  if (!element) {
    throw new Error(`Expected loom-metric-card to expose part="${part}".`);
  }
  return element;
}

function createMetricCard(maxDescriptionWidth?: string): HTMLElementTagNameMap['loom-metric-card'] {
  const card = document.createElement('loom-metric-card');
  card.setAttribute('title', 'Risk exposure');
  card.setAttribute('metric', '46%');
  card.setAttribute('description', 'Vulnerabilidades se encuentran retenidas por su impacto operacional durante el periodo.');

  if (maxDescriptionWidth) {
    card.style.setProperty('--loom-metric-card-description-max-width', maxDescriptionWidth);
  }

  const footer = document.createElement('p');
  footer.slot = 'footer';
  footer.textContent = 'Additional description';

  const action = document.createElement('a');
  action.slot = 'action';
  action.href = '#';
  action.textContent = 'Call To Action';

  card.append(footer, action);
  document.body.appendChild(card);
  return card;
}

describe('LoomMetricCard', () => {
  test('lets description use the available content track by default', async () => {
    const card = createMetricCard();
    await nextFrame();

    const content = getShadowPart<HTMLDivElement>(card, 'content');
    const description = getShadowPart<HTMLParagraphElement>(card, 'description');
    const footer = getShadowPart<HTMLDivElement>(card, 'footer');
    const action = getShadowPart<HTMLDivElement>(card, 'action');
    const descriptionStyles = getComputedStyle(description);

    expect(description.getBoundingClientRect().width).toBeGreaterThan(132);
    expect({
      contentDisplay: getComputedStyle(content).display,
      descriptionMaxWidth: descriptionStyles.maxWidth,
      descriptionMinWidth: descriptionStyles.minWidth,
      descriptionPart: description.getAttribute('part'),
      descriptionWidthMode: descriptionStyles.width === '132px' ? 'legacy-fixed' : 'fluid',
      actionHidden: action.hidden,
      footerHidden: footer.hidden,
    }).toMatchInlineSnapshot(`
      {
        "actionHidden": false,
        "contentDisplay": "grid",
        "descriptionMaxWidth": "none",
        "descriptionMinWidth": "0px",
        "descriptionPart": "description",
        "descriptionWidthMode": "fluid",
        "footerHidden": false,
      }
    `);
  });

  test('respects the public description max-width custom property', async () => {
    const card = createMetricCard('96px');
    await nextFrame();

    const description = getShadowPart<HTMLParagraphElement>(card, 'description');
    const descriptionStyles = getComputedStyle(description);

    expect(descriptionStyles.maxWidth).toBe('96px');
    expect(description.getBoundingClientRect().width).toBeLessThanOrEqual(96);
  });

  test('keeps description externally styleable through part', async () => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      loom-metric-card.description-part-demo::part(description) {
        max-width: 104px;
      }
    `;
    document.head.appendChild(styleElement);

    const card = createMetricCard();
    card.classList.add('description-part-demo');
    await nextFrame();

    const description = getShadowPart<HTMLParagraphElement>(card, 'description');

    expect(getComputedStyle(description).maxWidth).toBe('104px');
    expect(description.getBoundingClientRect().width).toBeLessThanOrEqual(104);

    styleElement.remove();
  });
});