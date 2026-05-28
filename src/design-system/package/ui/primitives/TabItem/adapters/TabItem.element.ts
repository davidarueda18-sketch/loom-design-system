import * as styles from '../TabItem.css.ts';

// ─── Law 8: module-level VE sheet cache ───────────────────────────────────────

const _sheetCache: Record<string, CSSStyleSheet | null> = {};

function cloneAsConstructedSheet(source: CSSStyleSheet): CSSStyleSheet | null {
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(Array.from(source.cssRules).map((r) => r.cssText).join('\n'));
    return sheet;
  } catch {
    return null;
  }
}

function getVESheet(anchorClass: string): CSSStyleSheet | null {
  if (anchorClass in _sheetCache) return _sheetCache[anchorClass];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      if (Array.from(sheet.cssRules).some((r) => r.cssText.includes(anchorClass))) {
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

// ─── LoomTabItem ──────────────────────────────────────────────────────────────

class LoomTabItem extends HTMLElement {
  // ─── Shadow DOM elements ─────────────────────────────────────────────────
  private _rootEl: HTMLDivElement | null = null;
  private _iconSlotEl: HTMLSlotElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;

  // ─── Observed attributes ─────────────────────────────────────────────────
  static observedAttributes = ['value', 'label', 'disabled', 'active', 'show-icon'] as const;

  // ─── Boolean getters/setters ──────────────────────────────────────────────

  get active(): boolean {
    return this.hasAttribute('active');
  }
  set active(val: boolean) {
    this.toggleAttribute('active', val);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    this.toggleAttribute('disabled', val);
  }

  // ─── String getters/setters ───────────────────────────────────────────────

  get value(): string {
    return this.getAttribute('value') ?? '';
  }
  set value(val: string) {
    this.setAttribute('value', val);
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }
  set label(val: string) {
    this.setAttribute('label', val);
  }

  get showIcon(): boolean {
    return this.hasAttribute('show-icon');
  }
  set showIcon(val: boolean) {
    this.toggleAttribute('show-icon', val);
  }

  // ─── Event handlers ───────────────────────────────────────────────────────

  private readonly _handleClick = (): void => {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('loom-tab-item-select', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  };

  private readonly _handleKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._handleClick();
    }
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = [getVESheet(styles.root)].filter((s): s is CSSStyleSheet => s != null);
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      }

      // Root row: slot[name=icon] + label span
      const rootEl = document.createElement('div');
      rootEl.setAttribute('part', 'root');
      this._rootEl = rootEl;

      const iconSlot = document.createElement('slot');
      iconSlot.name = 'icon';
      iconSlot.setAttribute('part', 'icon-slot');
      this._iconSlotEl = iconSlot;

      const labelEl = document.createElement('span');
      labelEl.setAttribute('part', 'label');
      this._labelEl = labelEl;

      rootEl.appendChild(iconSlot);
      rootEl.appendChild(labelEl);
      shadow.appendChild(rootEl);

      rootEl.addEventListener('click', this._handleClick);
      rootEl.addEventListener('keydown', this._handleKeydown);
    }

    this._sync();
  }

  disconnectedCallback(): void {
    this._rootEl?.removeEventListener('click', this._handleClick);
    this._rootEl?.removeEventListener('keydown', this._handleKeydown);
  }

  attributeChangedCallback(): void {
    this._scheduleSync();
  }

  // ─── Batching ─────────────────────────────────────────────────────────────

  private _syncScheduled = false;

  private _scheduleSync(): void {
    if (this._syncScheduled) return;
    this._syncScheduled = true;
    requestAnimationFrame(() => {
      this._syncScheduled = false;
      this._sync();
    });
  }

  // ─── Sync ─────────────────────────────────────────────────────────────────

  private _prev: { rootMod: string | null; labelMod: string | null } = {
    rootMod: null,
    labelMod: null,
  };

  private _sync(): void {
    if (!this._rootEl || !this._labelEl) return;

    const isDisabled = this.disabled;
    const isActive = this.active;

    // Root: base class + state modifier
    this._rootEl.className = '';
    this._rootEl.classList.add(styles.root);
    const nextRootMod = isDisabled ? styles.rootDisabled : isActive ? styles.rootActive : null;
    if (nextRootMod !== this._prev.rootMod) {
      if (this._prev.rootMod) this._rootEl.classList.remove(this._prev.rootMod);
      if (nextRootMod) this._rootEl.classList.add(nextRootMod);
      this._prev.rootMod = nextRootMod;
    } else if (nextRootMod) {
      this._rootEl.classList.add(nextRootMod);
    }

    // Icon slot visibility
    if (this._iconSlotEl) {
      this._iconSlotEl.hidden = !this.showIcon;
    }

    // Label text + color
    this._labelEl.textContent = this.label;
    this._labelEl.className = '';
    this._labelEl.classList.add(styles.label);
    const nextLabelMod = isDisabled ? styles.labelDisabled : null;
    if (nextLabelMod) this._labelEl.classList.add(nextLabelMod);
    this._prev.labelMod = nextLabelMod;

    // Accessibility
    this._rootEl.setAttribute('role', 'tab');
    this._rootEl.setAttribute('aria-selected', String(isActive));
    this._rootEl.setAttribute('tabindex', isDisabled ? '-1' : '0');
    if (isDisabled) this._rootEl.setAttribute('aria-disabled', 'true');
    else this._rootEl.removeAttribute('aria-disabled');
  }
}

customElements.define('loom-tab-item', LoomTabItem);

export { LoomTabItem };
