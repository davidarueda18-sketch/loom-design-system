import * as styles from '../Card.css.ts';
import type { CardVariant } from '../Card.types.ts';
import { CARD_VARIANTS } from '../Card.types.ts';

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

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_VARIANTS = new Set<CardVariant>(CARD_VARIANTS);

// ─── LoomCard ─────────────────────────────────────────────────────────────────

class LoomCard extends HTMLElement {
  static observedAttributes = ['variant', 'title', 'description'] as const;

  // ─── Getters / Setters ───────────────────────────────────────────────────

  get variant(): CardVariant {
    const val = this.getAttribute('variant') as CardVariant;
    return VALID_VARIANTS.has(val) ? val : 'default';
  }
  set variant(val: CardVariant) { this.setAttribute('variant', val); }

  get title(): string {
    return this.getAttribute('title') ?? '';
  }
  set title(val: string) {
    if (val) this.setAttribute('title', val);
    else this.removeAttribute('title');
  }

  get description(): string {
    return this.getAttribute('description') ?? '';
  }
  set description(val: string) {
    if (val) this.setAttribute('description', val);
    else this.removeAttribute('description');
  }

  // ─── Shadow DOM elements ─────────────────────────────────────────────────

  private _imageWrapperEl:  HTMLDivElement | null       = null;
  private _contentEl:       HTMLDivElement | null       = null;
  private _titleEl:         HTMLParagraphElement | null = null;
  private _descriptionEl:   HTMLParagraphElement | null = null;
  private _ctaEl:           HTMLDivElement | null       = null;

  // ─── State ───────────────────────────────────────────────────────────────

  private _prev: Record<string, string | null> = { variant: null };

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadow = this.attachShadow({ mode: 'open' });

      const sheets = getAdoptedStyleSheets();
      if (sheets.length > 0) {
        shadow.adoptedStyleSheets = sheets;
      } else {
        console.warn('[loom-card] VE stylesheet not found — shadow styles will be missing. Ensure the VE bundle is loaded before the adapter.');
      }

      // ── Image wrapper ───────────────────────────────────────────────────
      this._imageWrapperEl = document.createElement('div');
      this._imageWrapperEl.classList.add(styles.imageSlot);
      this._imageWrapperEl.setAttribute('part', 'image');
      this._imageWrapperEl.hidden = true;

      const imageSlot = document.createElement('slot');
      imageSlot.name = 'image';
      this._imageWrapperEl.appendChild(imageSlot);

      // ── Content wrapper ─────────────────────────────────────────────────
      this._contentEl = document.createElement('div');
      this._contentEl.classList.add(styles.content);
      this._contentEl.setAttribute('part', 'content');
      this._contentEl.hidden = true;

      this._titleEl = document.createElement('p');
      this._titleEl.classList.add(styles.title);
      this._titleEl.setAttribute('part', 'title');

      this._descriptionEl = document.createElement('p');
      this._descriptionEl.classList.add(styles.description);
      this._descriptionEl.setAttribute('part', 'description');
      this._descriptionEl.hidden = true;

      this._ctaEl = document.createElement('div');
      this._ctaEl.classList.add(styles.cta);
      this._ctaEl.setAttribute('part', 'cta');
      this._ctaEl.hidden = true;

      const actionSlot = document.createElement('slot');
      actionSlot.name = 'action';
      this._ctaEl.appendChild(actionSlot);

      this._contentEl.appendChild(this._titleEl);
      this._contentEl.appendChild(this._descriptionEl);
      this._contentEl.appendChild(this._ctaEl);

      // ── Default slot (free content) ─────────────────────────────────────
      const defaultSlot = document.createElement('slot');

      shadow.appendChild(this._imageWrapperEl);
      shadow.appendChild(this._contentEl);
      shadow.appendChild(defaultSlot);

      // ── Slot change listeners ───────────────────────────────────────────
      imageSlot.addEventListener('slotchange', () => {
        this._imageWrapperEl!.hidden = imageSlot.assignedNodes().length === 0;
      });

      actionSlot.addEventListener('slotchange', () => {
        this._ctaEl!.hidden = actionSlot.assignedNodes().length === 0;
      });
    }

    this.classList.add(styles.root);
    this._sync();
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

  private _sync(): void {
    if (!this._contentEl || !this._titleEl || !this._descriptionEl) return;

    // Variant class on host
    this._applyTo(this, this._prev, 'variant', this.variant, styles.variantMap as Record<string, string>);

    // Structured content: show when title attr is present
    const hasTitle = this.hasAttribute('title') && this.title.length > 0;
    this._contentEl.hidden = !hasTitle;

    if (hasTitle) {
      this._titleEl.textContent = this.title;
    }

    const hasDescription = this.hasAttribute('description') && this.description.length > 0;
    this._descriptionEl.hidden = !hasDescription;
    this._descriptionEl.textContent = hasDescription ? this.description : '';
  }

  // ─── Utility ─────────────────────────────────────────────────────────────

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

customElements.define('loom-card', LoomCard);

declare global {
  interface HTMLElementTagNameMap {
    'loom-card': LoomCard;
  }
}

export { LoomCard };
