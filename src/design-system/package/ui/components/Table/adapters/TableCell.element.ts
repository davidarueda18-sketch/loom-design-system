import * as styles from '../Cell.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type { TableCellAlign } from '../Table.types.ts';

const ALIGNS: readonly TableCellAlign[] = ['start', 'center', 'end'];

class LoomTableCell extends HTMLElement {
  static observedAttributes: readonly string[] = [
    'align',
    'numeric',
    'truncate',
    'col-span',
    'mobile-span',
    'mobile-label',
  ];

  get align(): TableCellAlign {
    const value = this.getAttribute('align');
    return value && (ALIGNS as readonly string[]).includes(value) ? (value as TableCellAlign) : 'start';
  }
  set align(value: TableCellAlign) {
    this.setAttribute('align', value);
  }

  get numeric(): boolean {
    return this.hasAttribute('numeric');
  }
  set numeric(value: boolean) {
    this.toggleAttribute('numeric', value);
  }

  get truncate(): boolean {
    return this.hasAttribute('truncate');
  }
  set truncate(value: boolean) {
    this.toggleAttribute('truncate', value);
  }

  get colSpan(): number {
    const n = Number(this.getAttribute('col-span'));
    return Number.isFinite(n) && n > 1 ? n : 1;
  }
  set colSpan(value: number) {
    if (value > 1) this.setAttribute('col-span', String(value));
    else this.removeAttribute('col-span');
  }

  get mobileLabel(): string {
    return this.getAttribute('mobile-label') ?? '';
  }
  set mobileLabel(value: string) {
    if (value) this.setAttribute('mobile-label', value);
    else this.removeAttribute('mobile-label');
  }

  protected _cellEl: HTMLDivElement | null = null;
  protected _contentEl: HTMLDivElement | null = null;
  protected _leadingWrapEl: HTMLDivElement | null = null;
  protected _leadingSlotEl: HTMLSlotElement | null = null;
  protected _trailingWrapEl: HTMLDivElement | null = null;
  protected _trailingSlotEl: HTMLSlotElement | null = null;
  protected _mobileLabelEl: HTMLSpanElement | null = null;

  protected _adoptStyleSheets(shadow: ShadowRoot): void {
    const sheets = collectAdoptedStyleSheets(styles.host);
    if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;
  }

  protected _hostRole(): string {
    return 'cell';
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });
      this._adoptStyleSheets(shadow);
      this._build(shadow);
    }
    this.classList.add(styles.host);
    if (!this.hasAttribute('role')) this.setAttribute('role', this._hostRole());
    this._sync();
  }

  protected _build(shadow: ShadowRoot): void {
    this._mobileLabelEl = document.createElement('span');
    this._mobileLabelEl.classList.add(styles.mobileLabel);
    this._mobileLabelEl.setAttribute('part', 'mobile-label');

    this._cellEl = document.createElement('div');
    this._cellEl.classList.add(styles.cell);
    this._cellEl.setAttribute('part', 'cell');

    this._leadingWrapEl = document.createElement('div');
    this._leadingWrapEl.classList.add(styles.leading);
    this._leadingWrapEl.setAttribute('part', 'leading');
    this._leadingSlotEl = document.createElement('slot');
    this._leadingSlotEl.name = 'leading';
    this._leadingWrapEl.appendChild(this._leadingSlotEl);

    this._contentEl = document.createElement('div');
    this._contentEl.classList.add(styles.content);
    this._contentEl.setAttribute('part', 'content');
    const defaultSlot = document.createElement('slot');
    this._contentEl.appendChild(defaultSlot);

    this._trailingWrapEl = document.createElement('div');
    this._trailingWrapEl.classList.add(styles.trailing);
    this._trailingWrapEl.setAttribute('part', 'trailing');
    this._trailingSlotEl = document.createElement('slot');
    this._trailingSlotEl.name = 'trailing';
    this._trailingWrapEl.appendChild(this._trailingSlotEl);

    this._cellEl.appendChild(this._mobileLabelEl);
    this._cellEl.appendChild(this._leadingWrapEl);
    this._cellEl.appendChild(this._contentEl);
    this._cellEl.appendChild(this._trailingWrapEl);
    shadow.appendChild(this._cellEl);

    this._leadingSlotEl.addEventListener('slotchange', this._handleSlotChange);
    this._trailingSlotEl.addEventListener('slotchange', this._handleSlotChange);
  }

  private readonly _handleSlotChange = (): void => { this._sync(); };

  attributeChangedCallback(): void {
    this._scheduleSync();
  }

  /** Called by the parent table to re-resolve ancestor-derived state (density, layout). */
  requestSync(): void {
    this._scheduleSync();
  }

  private _syncScheduled = false;
  protected _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  protected _hasAssigned(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;
    return slot.assignedNodes({ flatten: true }).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() !== '';
      return true;
    });
  }

  protected _resolveStacked(): boolean {
    const table = this.closest('loom-table');
    return table?.getAttribute('layout') === 'stacked';
  }

  protected _resolveCompact(): boolean {
    const table = this.closest('loom-table');
    return table?.getAttribute('density') === 'compact';
  }

  protected _sync(): void {
    if (!this._cellEl || !this._contentEl || !this._mobileLabelEl) return;

    this._cellEl.classList.toggle(styles.numeric, this.numeric);
    this._cellEl.classList.remove(styles.align.start, styles.align.center, styles.align.end);
    if (!this.numeric) this._cellEl.classList.add(styles.align[this.align]);
    this._cellEl.classList.toggle(styles.truncate, this.truncate);
    this._cellEl.classList.toggle(styles.compact, this._resolveCompact());

    const stacked = this._resolveStacked();
    this._cellEl.classList.toggle(styles.stackedCell, stacked);
    this._mobileLabelEl.classList.toggle(styles.mobileLabelVisible, stacked);
    this._mobileLabelEl.textContent = this.mobileLabel;
    this._mobileLabelEl.hidden = this.mobileLabel.length === 0;

    if (this.colSpan > 1) {
      this.style.setProperty('--loom-cell-col-span', `span ${this.colSpan}`);
    } else {
      this.style.removeProperty('--loom-cell-col-span');
    }

    if (this._leadingWrapEl) this._leadingWrapEl.hidden = !this._hasAssigned(this._leadingSlotEl);
    if (this._trailingWrapEl) this._trailingWrapEl.hidden = !this._hasAssigned(this._trailingSlotEl);
  }
}

customElements.define('loom-table-cell', LoomTableCell);

declare global {
  interface HTMLElementTagNameMap {
    'loom-table-cell': LoomTableCell;
  }
}

export { LoomTableCell };
