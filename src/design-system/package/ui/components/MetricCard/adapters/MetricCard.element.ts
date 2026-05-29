import * as styles from '../MetricCard.css.ts';

const _sheetCache: Record<string, CSSStyleSheet | null> = {};

function cloneAsConstructedSheet(source: CSSStyleSheet): CSSStyleSheet | null {
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(Array.from(source.cssRules).map((rule) => rule.cssText).join('\n'));
    return sheet;
  } catch {
    return null;
  }
}

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (anchorClass in _sheetCache) return _sheetCache[anchorClass];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((rule) => rule.cssText.includes(anchorClass))) {
        _sheetCache[anchorClass] = cloneAsConstructedSheet(sheet as CSSStyleSheet);
        return _sheetCache[anchorClass];
      }
    } catch {
      // cross-origin stylesheet — skip
    }
  }
  _sheetCache[anchorClass] = null;
  return null;
}

function getAdoptedStyleSheets(): CSSStyleSheet[] {
  return [getVESheet(styles.root)].filter((sheet): sheet is CSSStyleSheet => sheet != null);
}

class LoomMetricCard extends HTMLElement {
  static observedAttributes = ['title', 'metric', 'description'] as const;

  get title(): string {
    return this.getAttribute('title') ?? '';
  }
  set title(value: string) {
    if (value) this.setAttribute('title', value);
    else this.removeAttribute('title');
  }

  get metric(): string {
    return this.getAttribute('metric') ?? '';
  }
  set metric(value: string) {
    if (value) this.setAttribute('metric', value);
    else this.removeAttribute('metric');
  }

  get description(): string {
    return this.getAttribute('description') ?? '';
  }
  set description(value: string) {
    if (value) this.setAttribute('description', value);
    else this.removeAttribute('description');
  }

  private _titleEl: HTMLParagraphElement | null = null;
  private _titleSlotWrapperEl: HTMLDivElement | null = null;
  private _titleSlotEl: HTMLSlotElement | null = null;
  private _tagEl: HTMLDivElement | null = null;
  private _tagSlotEl: HTMLSlotElement | null = null;
  private _structuredBodyEl: HTMLDivElement | null = null;
  private _metricEl: HTMLParagraphElement | null = null;
  private _descriptionEl: HTMLParagraphElement | null = null;
  private _customBodyEl: HTMLDivElement | null = null;
  private _bodySlotEl: HTMLSlotElement | null = null;
  private _footerEl: HTMLDivElement | null = null;
  private _footerContentEl: HTMLDivElement | null = null;
  private _footerSlotEl: HTMLSlotElement | null = null;
  private _actionEl: HTMLDivElement | null = null;
  private _actionSlotEl: HTMLSlotElement | null = null;

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-metric-card] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }

      const headerEl = document.createElement('div');
      headerEl.classList.add(styles.header);
      headerEl.setAttribute('part', 'header');

      this._titleEl = document.createElement('p');
      this._titleEl.classList.add(styles.title);
      this._titleEl.setAttribute('part', 'title');

      this._titleSlotWrapperEl = document.createElement('div');
      this._titleSlotWrapperEl.classList.add(styles.titleSlot);
      this._titleSlotWrapperEl.setAttribute('part', 'title');

      this._titleSlotEl = document.createElement('slot');
      this._titleSlotEl.classList.add(styles.titleSlot);
      this._titleSlotEl.name = 'title';
      this._titleSlotWrapperEl.appendChild(this._titleSlotEl);

      this._tagEl = document.createElement('div');
      this._tagEl.classList.add(styles.tag);
      this._tagEl.setAttribute('part', 'tag');
      this._tagEl.hidden = true;

      this._tagSlotEl = document.createElement('slot');
      this._tagSlotEl.name = 'tag';
      this._tagEl.appendChild(this._tagSlotEl);

      headerEl.appendChild(this._titleEl);
      headerEl.appendChild(this._titleSlotWrapperEl);
      headerEl.appendChild(this._tagEl);

      const bodyEl = document.createElement('div');
      bodyEl.classList.add(styles.body);
      bodyEl.setAttribute('part', 'body');

      this._structuredBodyEl = document.createElement('div');
      this._structuredBodyEl.classList.add(styles.structuredBody);
      this._structuredBodyEl.setAttribute('part', 'content');
      this._structuredBodyEl.hidden = true;

      this._metricEl = document.createElement('p');
      this._metricEl.classList.add(styles.metric);
      this._metricEl.setAttribute('part', 'metric');
      this._metricEl.hidden = true;

      this._descriptionEl = document.createElement('p');
      this._descriptionEl.classList.add(styles.description);
      this._descriptionEl.setAttribute('part', 'description');
      this._descriptionEl.hidden = true;

      this._structuredBodyEl.appendChild(this._metricEl);
      this._structuredBodyEl.appendChild(this._descriptionEl);

      this._customBodyEl = document.createElement('div');
      this._customBodyEl.classList.add(styles.customBody);
      this._customBodyEl.setAttribute('part', 'custom-body');
      this._customBodyEl.hidden = true;

      this._bodySlotEl = document.createElement('slot');
      this._bodySlotEl.classList.add(styles.bodySlot);
      this._customBodyEl.appendChild(this._bodySlotEl);

      bodyEl.appendChild(this._structuredBodyEl);
      bodyEl.appendChild(this._customBodyEl);

      this._footerEl = document.createElement('div');
      this._footerEl.classList.add(styles.footer);
      this._footerEl.setAttribute('part', 'footer');
      this._footerEl.hidden = true;

      this._footerContentEl = document.createElement('div');
      this._footerContentEl.classList.add(styles.footerContent);
      this._footerContentEl.setAttribute('part', 'footer-content');
      this._footerContentEl.hidden = true;

      this._footerSlotEl = document.createElement('slot');
      this._footerSlotEl.classList.add(styles.footerSlot);
      this._footerSlotEl.name = 'footer';
      this._footerContentEl.appendChild(this._footerSlotEl);

      this._actionEl = document.createElement('div');
      this._actionEl.classList.add(styles.action);
      this._actionEl.setAttribute('part', 'action');
      this._actionEl.hidden = true;

      this._actionSlotEl = document.createElement('slot');
      this._actionSlotEl.classList.add(styles.actionSlot);
      this._actionSlotEl.name = 'action';
      this._actionEl.appendChild(this._actionSlotEl);

      this._footerEl.appendChild(this._footerContentEl);
      this._footerEl.appendChild(this._actionEl);

      shadow.appendChild(headerEl);
      shadow.appendChild(bodyEl);
      shadow.appendChild(this._footerEl);

      this._titleSlotEl.addEventListener('slotchange', () => { this._sync(); });
      this._tagSlotEl.addEventListener('slotchange', () => { this._sync(); });
      this._bodySlotEl.addEventListener('slotchange', () => { this._sync(); });
      this._footerSlotEl.addEventListener('slotchange', () => { this._sync(); });
      this._actionSlotEl.addEventListener('slotchange', () => { this._sync(); });
    }

    this.classList.add(styles.root);
    this._sync();
  }

  attributeChangedCallback(): void {
    this._scheduleSync();
  }

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  private _sync(): void {
    if (
      !this._titleEl || !this._titleSlotWrapperEl || !this._titleSlotEl ||
      !this._tagEl || !this._tagSlotEl || !this._structuredBodyEl || !this._metricEl ||
      !this._descriptionEl || !this._customBodyEl || !this._bodySlotEl || !this._footerEl || !this._footerContentEl ||
      !this._footerSlotEl || !this._actionEl || !this._actionSlotEl
    ) return;

    const hasTitleSlot = this._hasAssignedContent(this._titleSlotEl);
    const hasTitleAttribute = this.hasAttribute('title') && this.title.length > 0;
    this._titleEl.hidden = hasTitleSlot || !hasTitleAttribute;
    this._titleEl.textContent = hasTitleAttribute ? this.title : '';
    this._titleSlotWrapperEl.hidden = !hasTitleSlot;

    const hasTag = this._hasAssignedContent(this._tagSlotEl);
    this._tagEl.hidden = !hasTag;

    const hasCustomBody = this._hasAssignedContent(this._bodySlotEl);
    const hasMetric = this.hasAttribute('metric') && this.metric.length > 0;
    const hasDescription = this.hasAttribute('description') && this.description.length > 0;
    const useStructuredBody = !hasCustomBody && (hasMetric || hasDescription);

    this._structuredBodyEl.hidden = !useStructuredBody;
    this._metricEl.hidden = !hasMetric;
    this._metricEl.textContent = hasMetric ? this.metric : '';
    this._descriptionEl.hidden = !hasDescription;
    this._descriptionEl.textContent = hasDescription ? this.description : '';

    this._customBodyEl.hidden = !hasCustomBody;

    const hasFooter = this._hasAssignedContent(this._footerSlotEl);
    const hasAction = this._hasAssignedContent(this._actionSlotEl);
    this._footerContentEl.hidden = !hasFooter;
    this._actionEl.hidden = !hasAction;
    this._footerEl.hidden = !hasFooter && !hasAction;
  }

  private _hasAssignedContent(slot: HTMLSlotElement): boolean {
    return slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() !== '';
      return true;
    });
  }
}

customElements.define('loom-metric-card', LoomMetricCard);

declare global {
  interface HTMLElementTagNameMap {
    'loom-metric-card': LoomMetricCard;
  }
}

export { LoomMetricCard };