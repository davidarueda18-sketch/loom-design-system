import * as styles from '../Cell.css.ts';
import { collectAdoptedStyleSheets } from './adopted-styles.ts';
import type { TableCellAlign, TableCellVariant } from '../Table.types.ts';

const ALIGNS: readonly TableCellAlign[] = ['start', 'center', 'end'];
const VARIANTS: readonly TableCellVariant[] = ['content', 'default', 'key-value', 'state', 'progress', 'team'];

function formatDate(val: string | null): string {
  if (!val) return '-';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '-';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

class LoomTableCell extends HTMLElement {
  static observedAttributes: readonly string[] = [
    'align',
    'numeric',
    'truncate',
    'col-span',
    'mobile-span',
    'mobile-order',
    'mobile-align',
    'mobile-label',
    // typed-variant attributes
    'variant',
    'label',
    'description',
    'show-description',
    'badge-label',
    'badge-state',
    'cell-key',
    'description-key',
    'show-progress',
    'progress-value',
    'start-date',
    'target-date',
    'start-label',
    'target-label',
    'leader-label',
  ];

  // ── Generic cell props ─────────────────────────────────────────────────────

  get align(): TableCellAlign {
    const value = this.getAttribute('align');
    return value && (ALIGNS as readonly string[]).includes(value) ? (value as TableCellAlign) : 'start';
  }
  set align(value: TableCellAlign) { this.setAttribute('align', value); }

  get numeric(): boolean { return this.hasAttribute('numeric'); }
  set numeric(value: boolean) { this.toggleAttribute('numeric', value); }

  get truncate(): boolean { return this.hasAttribute('truncate'); }
  set truncate(value: boolean) { this.toggleAttribute('truncate', value); }

  get colSpan(): number {
    const n = Number(this.getAttribute('col-span'));
    return Number.isFinite(n) && n > 1 ? n : 1;
  }
  set colSpan(value: number) {
    if (value > 1) this.setAttribute('col-span', String(value));
    else this.removeAttribute('col-span');
  }

  get mobileLabel(): string { return this.getAttribute('mobile-label') ?? ''; }
  set mobileLabel(value: string) {
    if (value) this.setAttribute('mobile-label', value);
    else this.removeAttribute('mobile-label');
  }

  get mobileOrder(): number {
    const n = Number(this.getAttribute('mobile-order'));
    return Number.isFinite(n) ? n : -1;
  }
  set mobileOrder(value: number) {
    if (value >= 0) this.setAttribute('mobile-order', String(value));
    else this.removeAttribute('mobile-order');
  }

  get mobileAlign(): TableCellAlign {
    const v = this.getAttribute('mobile-align');
    return v && (ALIGNS as readonly string[]).includes(v) ? (v as TableCellAlign) : 'start';
  }
  set mobileAlign(value: TableCellAlign) { this.setAttribute('mobile-align', value); }

  // ── Typed-variant props ────────────────────────────────────────────────────

  get variant(): TableCellVariant {
    const v = this.getAttribute('variant');
    return v && (VARIANTS as readonly string[]).includes(v) ? (v as TableCellVariant) : 'content';
  }
  set variant(value: TableCellVariant) { this.setAttribute('variant', value); }

  get label(): string { return this.getAttribute('label') ?? ''; }
  set label(v: string) { if (v) this.setAttribute('label', v); else this.removeAttribute('label'); }

  get description(): string { return this.getAttribute('description') ?? ''; }
  set description(v: string) { if (v) this.setAttribute('description', v); else this.removeAttribute('description'); }

  get showDescription(): boolean { return this.getAttribute('show-description') !== 'false'; }

  get badgeLabel(): string { return this.getAttribute('badge-label') ?? ''; }
  get badgeState(): string { return this.getAttribute('badge-state') ?? 'default'; }

  get cellKey(): string { return this.getAttribute('cell-key') ?? ''; }
  get descriptionKey(): string { return this.getAttribute('description-key') ?? ''; }
  get showProgress(): boolean { return this.hasAttribute('show-progress'); }
  get progressValue(): number { return Number(this.getAttribute('progress-value') ?? 0); }

  get startDate(): string | null { return this.getAttribute('start-date'); }
  get targetDate(): string | null { return this.getAttribute('target-date'); }
  get startLabel(): string { return this.getAttribute('start-label') ?? 'Inicio:'; }
  get targetLabel(): string { return this.getAttribute('target-label') ?? 'Fin:'; }

  get leaderLabel(): string { return this.getAttribute('leader-label') ?? ''; }

  // ── Shadow DOM refs ────────────────────────────────────────────────────────

  protected _cellEl: HTMLDivElement | null = null;
  protected _contentEl: HTMLDivElement | null = null;
  protected _leadingWrapEl: HTMLDivElement | null = null;
  protected _leadingSlotEl: HTMLSlotElement | null = null;
  protected _trailingWrapEl: HTMLDivElement | null = null;
  protected _trailingSlotEl: HTMLSlotElement | null = null;
  protected _mobileLabelEl: HTMLSpanElement | null = null;

  private _slotWrapperEl: HTMLDivElement | null = null;
  private _variantWrapperEl: HTMLDivElement | null = null;

  // ── Style adoption ─────────────────────────────────────────────────────────

  protected _adoptStyleSheets(shadow: ShadowRoot): void {
    const sheets = collectAdoptedStyleSheets(styles.host);
    if (sheets.length > 0) shadow.adoptedStyleSheets = sheets;
  }

  protected _hostRole(): string { return 'cell'; }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

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

    // Variant wrapper (shown when variant !== 'content') — appended FIRST so it
    // renders above the slotted content (e.g. leader label above avatar group).
    this._variantWrapperEl = document.createElement('div');
    this._variantWrapperEl.classList.add(styles.variantWrapper);
    this._variantWrapperEl.setAttribute('part', 'variant-content');
    this._variantWrapperEl.hidden = true;
    this._contentEl.appendChild(this._variantWrapperEl);

    // Default slot wrapper — ONE unnamed slot per shadow root.
    // Hidden for most typed variants; kept visible for 'team' so slotted
    // loom-avatar-group renders below the leader label.
    this._slotWrapperEl = document.createElement('div');
    this._slotWrapperEl.classList.add(styles.slotWrapper);
    const defaultSlot = document.createElement('slot');
    this._slotWrapperEl.appendChild(defaultSlot);
    this._contentEl.appendChild(this._slotWrapperEl);

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

  attributeChangedCallback(): void { this._scheduleSync(); }

  requestSync(): void { this._scheduleSync(); }

  private _syncScheduled = false;
  protected _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => { this._syncScheduled = false; this._sync(); });
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

    // mobile-span
    const mobileSpan = this.getAttribute('mobile-span');
    if (mobileSpan === 'full') this.style.setProperty('--loom-cell-mobile-col-span', '1 / -1');
    else if (mobileSpan === 'half') this.style.setProperty('--loom-cell-mobile-col-span', 'auto');
    else this.style.removeProperty('--loom-cell-mobile-col-span');

    // mobile-order
    const mobileOrder = this.mobileOrder;
    if (mobileOrder >= 0) this.style.setProperty('--loom-cell-mobile-order', String(mobileOrder));
    else this.style.removeProperty('--loom-cell-mobile-order');

    // mobile-align
    const ma = this.mobileAlign;
    const maCssMap: Record<TableCellAlign, string> = { start: 'flex-start', center: 'center', end: 'flex-end' };
    this.style.setProperty('--loom-cell-mobile-align', maCssMap[ma]);

    // Apply mobileOrderable class when any mobile CSS var is active
    const hasMobileOverride = mobileOrder >= 0 || !!mobileSpan || ma !== 'start';
    this.classList.toggle(styles.mobileOrderable, hasMobileOverride);

    if (this._leadingWrapEl) this._leadingWrapEl.hidden = !this._hasAssigned(this._leadingSlotEl);
    if (this._trailingWrapEl) this._trailingWrapEl.hidden = !this._hasAssigned(this._trailingSlotEl);

    // ── Typed variant ─────────────────────────────────────────────────
    const variant = this.variant;
    const isTyped = variant !== 'content';
    // 'team' needs the default slot visible for slotted loom-avatar-group;
    // other typed variants hide the slot and render entirely from attributes.
    const isTeam = variant === 'team';

    if (this._slotWrapperEl) this._slotWrapperEl.hidden = isTyped && !isTeam;
    if (this._variantWrapperEl) {
      this._variantWrapperEl.hidden = !isTyped;
      if (isTyped) this._renderVariant(variant);
    }
  }

  private _renderVariant(variant: TableCellVariant): void {
    if (!this._variantWrapperEl) return;
    this._variantWrapperEl.innerHTML = '';
    const el = this._variantWrapperEl;

    const container = document.createElement('div');
    container.classList.add(styles.variantContent);

    switch (variant) {
      case 'default':  this._buildDefault(container);  break;
      case 'key-value': this._buildKeyValue(container); break;
      case 'state':    this._buildState(container);    break;
      case 'progress': this._buildProgress(container); break;
      case 'team':     this._buildTeam(container);     break;
    }

    el.appendChild(container);
  }

  private _buildDefault(c: HTMLElement): void {
    const row = document.createElement('div');
    row.classList.add(styles.variantRowEnd);

    const label = document.createElement('p');
    label.classList.add(styles.variantLabel);
    label.textContent = this.label;
    row.appendChild(label);

    if (this.badgeLabel) {
      const badge = document.createElement('span');
      badge.classList.add(styles.variantBadge);
      badge.textContent = this.badgeLabel;
      if (this.badgeState && this.badgeState !== 'default') {
        const badgeEl = document.createElement('loom-badge') as HTMLElement;
        badgeEl.setAttribute('state', this.badgeState);
        badgeEl.setAttribute('label', this.badgeLabel);
        row.appendChild(badgeEl);
      } else {
        row.appendChild(badge);
      }
    }

    c.appendChild(row);

    if (this.showDescription && this.description) {
      const desc = document.createElement('p');
      desc.classList.add(styles.variantSubtext);
      desc.textContent = this.description;
      c.appendChild(desc);
    }
  }

  private _buildKeyValue(c: HTMLElement): void {
    const row1 = document.createElement('div');
    row1.classList.add(styles.variantRow);
    if (this.cellKey) {
      const key = document.createElement('p');
      key.classList.add(styles.variantKey);
      key.textContent = this.cellKey;
      row1.appendChild(key);
    }
    const val = document.createElement('p');
    val.classList.add(styles.variantSubtext);
    val.style.color = 'var(--loom-color-text-primary, #fff)';
    val.style.fontSize = 'inherit';
    val.textContent = this.label || '-';
    row1.appendChild(val);
    c.appendChild(row1);

    if (this.descriptionKey || this.description) {
      const row2 = document.createElement('div');
      row2.classList.add(styles.variantRow);
      if (this.descriptionKey) {
        const dKey = document.createElement('p');
        dKey.classList.add(styles.variantKey);
        dKey.textContent = this.descriptionKey;
        row2.appendChild(dKey);
      }
      const dVal = document.createElement('p');
      dVal.classList.add(styles.variantSubtext);
      dVal.textContent = this.description || '-';
      row2.appendChild(dVal);
      c.appendChild(row2);
    }

    if (this.showProgress) {
      const progress = document.createElement('loom-progress-linear') as HTMLElement;
      progress.setAttribute('value', String(Math.min(100, Math.max(0, this.progressValue))));
      progress.setAttribute('max', '100');
      progress.style.width = '100%';
      progress.style.marginTop = '4px';
      c.appendChild(progress);
    }
  }

  private _buildState(c: HTMLElement): void {
    const badge = document.createElement('loom-badge') as HTMLElement;
    badge.setAttribute('state', this.badgeState);
    if (this.label) badge.setAttribute('label', this.label);
    c.appendChild(badge);
  }

  private _buildProgress(c: HTMLElement): void {
    const row1 = document.createElement('div');
    row1.classList.add(styles.variantRow);
    const sl = document.createElement('span'); sl.classList.add(styles.variantKey); sl.textContent = this.startLabel; row1.appendChild(sl);
    const sv = document.createElement('span'); sv.classList.add(styles.variantSubtext); sv.style.color = 'var(--loom-color-text-primary, #fff)'; sv.textContent = formatDate(this.startDate); row1.appendChild(sv);
    c.appendChild(row1);

    const row2 = document.createElement('div');
    row2.classList.add(styles.variantRow);
    const tl = document.createElement('span'); tl.classList.add(styles.variantKey); tl.textContent = this.targetLabel; row2.appendChild(tl);
    const tv = document.createElement('span'); tv.classList.add(styles.variantSubtext); tv.style.color = 'var(--loom-color-text-primary, #fff)'; tv.textContent = formatDate(this.targetDate); row2.appendChild(tv);
    c.appendChild(row2);
  }

  private _buildTeam(c: HTMLElement): void {
    if (this.leaderLabel) {
      const leader = document.createElement('p');
      leader.classList.add(styles.variantLeaderLabel);
      leader.textContent = this.leaderLabel;
      c.appendChild(leader);
    }
    // The avatar group is slotted via the default slot (_slotWrapperEl),
    // which remains visible for the 'team' variant. No second <slot> needed.
  }
}

customElements.define('loom-table-cell', LoomTableCell);

declare global {
  interface HTMLElementTagNameMap { 'loom-table-cell': LoomTableCell; }
}

export { LoomTableCell };
