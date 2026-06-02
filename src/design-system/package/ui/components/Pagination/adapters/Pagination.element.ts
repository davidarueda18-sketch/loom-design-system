import * as styles from '../Pagination.css.ts';
import '../../../primitives/Fab/adapters/Fab.element.ts';
import type {
  PaginationChangeEventDetail,
  PaginationSizeChangeEventDetail,
} from '../Pagination.types.ts';

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
      // cross-origin — skip
    }
  }
  _sheetCache[anchorClass] = null;
  return null;
}

type PageItem = number | 'ellipsis';

/** Builds the visible page list: 1 … (current±siblings) … last. */
function buildRange(current: number, totalPages: number, siblings: number): PageItem[] {
  if (totalPages <= 1) return [1];
  const items: PageItem[] = [];
  const left = Math.max(2, current - siblings);
  const right = Math.min(totalPages - 1, current + siblings);
  items.push(1);
  if (left > 2) items.push('ellipsis');
  for (let p = left; p <= right; p++) items.push(p);
  if (right < totalPages - 1) items.push('ellipsis');
  if (totalPages > 1) items.push(totalPages);
  return items;
}

class LoomPagination extends HTMLElement {
  static observedAttributes = [
    'page',
    'page-size',
    'total-items',
    'page-size-options',
    'siblings',
    'compact',
    'disabled',
  ] as const;

  get page(): number {
    const n = Number(this.getAttribute('page'));
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
  }
  set page(value: number) {
    this.setAttribute('page', String(value));
  }

  get pageSize(): number {
    const n = Number(this.getAttribute('page-size'));
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 10;
  }
  set pageSize(value: number) {
    this.setAttribute('page-size', String(value));
  }

  get totalItems(): number {
    const n = Number(this.getAttribute('total-items'));
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  }
  set totalItems(value: number) {
    this.setAttribute('total-items', String(value));
  }

  get siblings(): number {
    const n = Number(this.getAttribute('siblings'));
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 1;
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  private _navEl: HTMLElement | null = null;
  private _summaryWrapEl: HTMLDivElement | null = null;
  private _controlsEl: HTMLDivElement | null = null;
  private _prevEl: HTMLElement | null = null;
  private _nextEl: HTMLElement | null = null;
  private _pagesEl: HTMLDivElement | null = null;
  private _sizeWrapEl: HTMLDivElement | null = null;
  private _sizeSelectEl: HTMLSelectElement | null = null;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      const sheet = getVESheet(styles.root);
      if (sheet) shadow.adoptedStyleSheets = [sheet];
      this._build(shadow);
    }
    if (!this.hasAttribute('role')) this.setAttribute('role', 'navigation');
    if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Paginación');
    this._sync();
  }

  disconnectedCallback(): void {
    this._prevEl?.removeEventListener('click', this._handlePrev);
    this._nextEl?.removeEventListener('click', this._handleNext);
    this._sizeSelectEl?.removeEventListener('change', this._handleSizeChange);
  }

  private _build(shadow: ShadowRoot): void {
    this._navEl = document.createElement('div');
    this._navEl.classList.add(styles.root);
    this._navEl.setAttribute('part', 'nav');

    this._summaryWrapEl = document.createElement('div');
    this._summaryWrapEl.classList.add(styles.summary);
    this._summaryWrapEl.setAttribute('part', 'summary');
    const summarySlot = document.createElement('slot');
    summarySlot.name = 'summary';
    this._summaryWrapEl.appendChild(summarySlot);

    this._controlsEl = document.createElement('div');
    this._controlsEl.classList.add(styles.controls);

    this._sizeWrapEl = document.createElement('div');
    this._sizeWrapEl.classList.add(styles.sizeSelect);
    this._sizeWrapEl.setAttribute('part', 'size-select');
    this._sizeSelectEl = document.createElement('select');
    this._sizeSelectEl.setAttribute('aria-label', 'Resultados por página');
    this._sizeSelectEl.addEventListener('change', this._handleSizeChange);
    this._sizeWrapEl.appendChild(this._sizeSelectEl);

    this._prevEl = document.createElement('loom-fab');
    this._prevEl.setAttribute('size', 'sm');
    this._prevEl.setAttribute('content', 'icon');
    this._prevEl.setAttribute('aria-label', 'Página anterior');
    this._prevEl.setAttribute('part', 'prev');
    this._prevEl.textContent = '‹';
    this._prevEl.addEventListener('click', this._handlePrev);

    this._pagesEl = document.createElement('div');
    this._pagesEl.classList.add(styles.pages);

    this._nextEl = document.createElement('loom-fab');
    this._nextEl.setAttribute('size', 'sm');
    this._nextEl.setAttribute('content', 'icon');
    this._nextEl.setAttribute('aria-label', 'Página siguiente');
    this._nextEl.setAttribute('part', 'next');
    this._nextEl.textContent = '›';
    this._nextEl.addEventListener('click', this._handleNext);

    this._controlsEl.appendChild(this._sizeWrapEl);
    this._controlsEl.appendChild(this._prevEl);
    this._controlsEl.appendChild(this._pagesEl);
    this._controlsEl.appendChild(this._nextEl);

    this._navEl.appendChild(this._summaryWrapEl);
    this._navEl.appendChild(this._controlsEl);
    shadow.appendChild(this._navEl);
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
    if (!this._prevEl || !this._nextEl || !this._pagesEl || !this._sizeWrapEl || !this._sizeSelectEl) return;

    const current = Math.min(this.page, this.totalPages);
    this._prevEl.toggleAttribute('disabled', this.disabled || current <= 1);
    this._nextEl.toggleAttribute('disabled', this.disabled || current >= this.totalPages);

    const options = (this.getAttribute('page-size-options') ?? '')
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
    this._sizeWrapEl.hidden = options.length === 0;
    if (options.length > 0) {
      this._sizeSelectEl.replaceChildren();
      for (const opt of options) {
        const optionEl = document.createElement('option');
        optionEl.value = String(opt);
        optionEl.textContent = String(opt);
        if (opt === this.pageSize) optionEl.selected = true;
        this._sizeSelectEl.appendChild(optionEl);
      }
      this._sizeSelectEl.disabled = this.disabled;
    }

    // Rebuilds page controls on each sync so handlers always close over current state.
    this._pagesEl.replaceChildren();
    const items = buildRange(current, this.totalPages, this.siblings);
    for (const item of items) {
      if (item === 'ellipsis') {
        const span = document.createElement('span');
        span.classList.add(styles.ellipsis);
        span.textContent = '…';
        this._pagesEl.appendChild(span);
        continue;
      }
      const wrap = document.createElement('span');
      const isActive = item === current;
      wrap.classList.add(isActive ? styles.pageButtonActive : styles.pageButton);
      const fab = document.createElement('loom-fab');
      fab.setAttribute('size', 'sm');
      fab.setAttribute('content', 'text');
      fab.setAttribute('label', String(item));
      fab.setAttribute('aria-label', `Página ${item}`);
      if (isActive) fab.setAttribute('aria-current', 'page');
      if (this.disabled) fab.setAttribute('disabled', '');
      fab.addEventListener('click', () => this._goTo(item));
      wrap.appendChild(fab);
      this._pagesEl.appendChild(wrap);
    }
  }

  private _goTo(page: number): void {
    if (this.disabled) return;
    const clamped = Math.min(Math.max(1, page), this.totalPages);
    if (clamped === this.page) return;
    this.page = clamped;
    this.dispatchEvent(
      new CustomEvent<PaginationChangeEventDetail>('loom-pagination-change', {
        bubbles: true,
        composed: true,
        detail: { page: clamped, pageSize: this.pageSize },
      }),
    );
  }

  private readonly _handlePrev = (): void => { this._goTo(this.page - 1); };
  private readonly _handleNext = (): void => { this._goTo(this.page + 1); };

  private readonly _handleSizeChange = (event: Event): void => {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isFinite(value) || value <= 0) return;
    this.pageSize = value;
    this.dispatchEvent(
      new CustomEvent<PaginationSizeChangeEventDetail>('loom-pagination-size-change', {
        bubbles: true,
        composed: true,
        detail: { pageSize: value },
      }),
    );
  };
}

customElements.define('loom-pagination', LoomPagination);

declare global {
  interface HTMLElementTagNameMap {
    'loom-pagination': LoomPagination;
  }
}

export { LoomPagination };
