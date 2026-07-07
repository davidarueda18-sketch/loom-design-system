import * as styles from '../Badge.css.ts';
import type { BadgeState, BadgeVariant } from '../Badge.types.ts';

const VALID_STATES = new Set<BadgeState>(['default', 'progress', 'success', 'warning', 'danger', 'info']);
const VALID_VARIANTS = new Set<BadgeVariant>(['default', 'filled']);

// ─── Filled-variant icons (heroicons micro, 16px solid) — fixed per state ────
// `progress` has no static icon; it renders the indeterminate spinner instead.

const ICON_SVGS: Record<Exclude<BadgeState, 'progress'>, string> = {
  default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" width="14" height="14"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.38259 0.941982C8.65005 1.07308 8.79567 1.36787 8.73726 1.65995L8.01925 5.25H11.5938C11.8507 5.25 12.084 5.39994 12.1907 5.63366C12.2974 5.86738 12.2579 6.14189 12.0897 6.33605L6.40217 12.8985C6.20709 13.1236 5.88488 13.1891 5.61742 13.058C5.34995 12.9269 5.20433 12.6321 5.26274 12.3401L5.98075 8.75H2.40625C2.14932 8.75 1.91602 8.60006 1.80929 8.36634C1.70257 8.13262 1.74206 7.85812 1.91033 7.66395L7.59783 1.10145C7.79291 0.87636 8.11512 0.810883 8.38259 0.941982Z"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="16" height="16"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM11.8435 6.20859C12.0967 5.88082 12.0363 5.40981 11.7086 5.15654C11.3808 4.90327 10.9098 4.96365 10.6565 5.29141L6.95615 10.0801L5.30747 8.24828C5.03038 7.94039 4.55616 7.91543 4.24828 8.19253C3.94039 8.46962 3.91544 8.94384 4.19253 9.25172L6.44253 11.7517C6.59132 11.917 6.80582 12.0078 7.02809 11.9995C7.25036 11.9911 7.45746 11.8846 7.59346 11.7086L11.8435 6.20859Z"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="16" height="16"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 6a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>`,
  danger: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="16" height="16"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM5.25 7.25a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Z"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="16" height="16"><mask id="loom-badge-info-mask"><rect width="16" height="16" fill="white"/><circle cx="8" cy="4.75" r="1" fill="black"/><rect x="7" y="7" width="2" height="5.5" rx="1" fill="black"/></mask><path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" mask="url(#loom-badge-info-mask)"/></svg>`,
};

// ─── Progress spinner (filled + state=progress) — indeterminate, decorative ──

const SPINNER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" class="${styles.spinnerSvg}"><circle class="${styles.spinnerTrack}" cx="8" cy="8" r="6.25" stroke-width="1.8"/><circle class="${styles.spinnerArc}" cx="8" cy="8" r="6.25" stroke-width="1.8"/></svg>`;

// ─── VE stylesheet adoption ───────────────────────────────────────────────────

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

function getAdoptedStyleSheets(): CSSStyleSheet[] {
  return [getVESheet(styles.root)].filter((s): s is CSSStyleSheet => s != null);
}

// ─── LoomBadge ────────────────────────────────────────────────────────────────

class LoomBadge extends HTMLElement {
  static observedAttributes = ['state', 'variant', 'label', 'show-label'] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────

  get state(): BadgeState {
    const val = this.getAttribute('state') as BadgeState;
    return VALID_STATES.has(val) ? val : 'default';
  }
  set state(val: BadgeState) {
    this.setAttribute('state', val);
  }

  get variant(): BadgeVariant {
    const val = this.getAttribute('variant') as BadgeVariant;
    return VALID_VARIANTS.has(val) ? val : 'default';
  }
  set variant(val: BadgeVariant) {
    this.setAttribute('variant', val);
  }

  get label(): string | null {
    return this.getAttribute('label');
  }
  set label(val: string | null) {
    if (val == null) this.removeAttribute('label');
    else this.setAttribute('label', val);
  }

  get showLabel(): boolean {
    return this.getAttribute('show-label') !== 'false';
  }
  set showLabel(val: boolean) {
    this.setAttribute('show-label', String(val));
  }

  // ─── Shadow DOM elements ─────────────────────────────────────────────────

  private _dotEl: HTMLSpanElement | null = null;
  private _iconEl: HTMLSpanElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;

  // ─── Prev-state (for idempotent _sync) ───────────────────────────────────

  private _prev: Record<string, string | null> = { appearance: null };

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-badge] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }

      this._dotEl = document.createElement('span');
      this._dotEl.setAttribute('part', 'dot');
      this._dotEl.setAttribute('aria-hidden', 'true');
      this._dotEl.classList.add(styles.dot);

      this._iconEl = document.createElement('span');
      this._iconEl.setAttribute('part', 'icon');
      this._iconEl.setAttribute('aria-hidden', 'true');
      this._iconEl.classList.add(styles.iconWrapper);

      this._labelEl = document.createElement('span');
      this._labelEl.setAttribute('part', 'label');

      shadow.appendChild(this._labelEl);

      this.classList.add(styles.root);
    }
    this._sync();
  }

  // Law 4: name-aware routing — aria-* must bypass RAF for synchronous a11y
  attributeChangedCallback(name: string): void {
    if (name.startsWith('aria-')) { this._syncA11y(); return; }
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

  private _sync(): void {
    if (!this._dotEl || !this._iconEl || !this._labelEl) return;

    const badgeState = this.state;
    const variant = this.variant;
    const label = this.label;
    const showLabel = this.showLabel;

    const classMap = variant === 'filled' ? styles.filled : styles.state;
    this._applyTo(this, this._prev, 'appearance', badgeState, classMap as Record<string, string>);

    if (variant === 'filled') {
      if (this._dotEl.isConnected) this._dotEl.remove();
      this._iconEl.innerHTML = badgeState === 'progress' ? SPINNER_SVG : (ICON_SVGS[badgeState] ?? '');
      if (!this._iconEl.isConnected) this.shadowRoot?.insertBefore(this._iconEl, this._labelEl);
    } else {
      if (this._iconEl.isConnected) { this._iconEl.remove(); this._iconEl.innerHTML = ''; }
      if (!this._dotEl.isConnected) this.shadowRoot?.insertBefore(this._dotEl, this._labelEl);
    }

    this._labelEl.textContent = label ?? '';
    this._labelEl.hidden = label == null;
    this._labelEl.classList.toggle(styles.srOnly, label != null && !showLabel);

    this._syncA11y();
  }

  // Forward any future aria-* attributes from host to label part
  private _syncA11y(): void {
    if (!this._labelEl) return;
    ['aria-label', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
      const val = this.getAttribute(attr);
      if (val) this._labelEl!.setAttribute(attr, val);
      else this._labelEl!.removeAttribute(attr);
    });
  }

  private _applyTo(
    el: Element,
    prev: Record<string, string | null>,
    prop: string,
    key: string | null,
    classMap: Record<string, string>,
  ): void {
    const next = key != null && key in classMap ? classMap[key] : null;
    const old  = prev[prop] ?? null;
    if (next === old) return;
    if (old)  el.classList.remove(...old.split(/\s+/).filter(Boolean));
    if (next) el.classList.add(...next.split(/\s+/).filter(Boolean));
    prev[prop] = next;
  }
}

customElements.define('loom-badge', LoomBadge);

declare global {
  interface HTMLElementTagNameMap {
    'loom-badge': LoomBadge;
  }
}

export { LoomBadge };
